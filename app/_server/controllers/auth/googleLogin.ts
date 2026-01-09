import { User } from '../../models/user';
import { AppError } from '../../lib/utils/appError';
import { generateRandomString } from '../../lib/utils/helpers';
import { createAuthTokens } from '../../lib/utils/tokens';
import { deleteFields } from '../../middlewares/protectRoutes';
import { unselectedFields } from '../../models/user';
import { catchAsync } from '../../middlewares/catchAsync';
import { sendResponse } from '../../lib/utils/appResponse';
import { RequestContext, withRequestContext } from '../../lib/context/withRequestContext';
import { OAuth2Client } from 'google-auth-library';
import { ENVIRONMENT } from '../../lib/config/environment';
import { getRoleWithSlug } from '../../lib/utils/helpers';
import { logger } from '../../lib/utils/logger';
import { ModelUser } from '../../lib/types/constants';
import { NextRequest } from 'next/server';

// Check if Google credentials are configured
if (!ENVIRONMENT.GOOGLE?.CLIENT_ID || !ENVIRONMENT.GOOGLE?.CLIENT_SECRET) {
  logger.warn('Google OAuth credentials not configured. Google login will not work.');
}

// Google login controller (public endpoint)
export const googleLogin = withRequestContext({ protect: false })(
  catchAsync(async context => {
    const { req, body } = context as RequestContext;
    const { googleCode } = body;

    if (!googleCode) {
      throw new AppError('Google code is required', 400);
    }

    if (!ENVIRONMENT.GOOGLE?.CLIENT_ID || !ENVIRONMENT.GOOGLE?.CLIENT_SECRET) {
      throw new AppError('Google OAuth is not configured', 500);
    }

    const googleClient = new OAuth2Client({
      clientId: ENVIRONMENT.GOOGLE.CLIENT_ID,
      clientSecret: ENVIRONMENT.GOOGLE.CLIENT_SECRET,
      redirectUri: 'postmessage',
    });

    // Exchange the auth code for tokens
    let tokenRes;
    try {
      tokenRes = await googleClient.getToken(googleCode);
    } catch (error) {
      logger.error('Error exchanging code:', error);
      throw new AppError('Exchanging google code for tokens failed', 401);
    }

    if (!tokenRes) {
      throw new AppError('Exchanging google code for tokens failed', 401);
    }

    const tokens = tokenRes.tokens;

    if (!tokens.id_token) {
      throw new AppError('Failed to get ID token', 401);
    }

    // Verify google token
    const ticket = await googleClient.verifyIdToken({
      idToken: tokens.id_token,
      audience: ENVIRONMENT.GOOGLE.CLIENT_ID,
    });

    const payload = ticket.getPayload();

    if (!payload) {
      throw new AppError('Google token is invalid', 401);
    }

    const { sub, email, email_verified, name, picture, given_name, family_name } = payload;

    if (!email) {
      throw new AppError('Google account has no email', 401);
    }

    const namesSplit = (name ?? '').split(' ');

    // Check if email or googleId already exists
    const dbUser = await User.findOne({
      $or: [{ googleId: sub }, { email: email.toLowerCase() }],
    })
      .select(unselectedFields.join(' '))
      .lean<ModelUser>();

    // Register new user or login existing user
    const user = !dbUser
      ? await registerUser(
          req,
          email,
          email_verified,
          given_name,
          family_name,
          namesSplit,
          sub,
          picture
        )
      : await userLogin(req, dbUser, sub);

    // Remove sensitive fields before returning
    const sanitizedUser = await deleteFields(user, unselectedFields);

    return sendResponse(
      200,
      {
        user: sanitizedUser,
      },
      dbUser ? 'Login successful' : 'Account created and logged in successfully'
    );
  })
);

// Register a new user with Google OAuth
async function registerUser(
  req: NextRequest,
  email: string,
  email_verified: boolean | undefined,
  given_name: string | undefined,
  family_name: string | undefined,
  namesSplit: string[],
  sub: string,
  picture: string | undefined
): Promise<ModelUser> {
  const customerRole = await getRoleWithSlug('customer');

  if (!customerRole) {
    throw new AppError('Customer role not found', 500);
  }

  const JTI = generateRandomString(16, 'JTI');

  const newUser = await User.create({
    firstName: given_name || namesSplit[0] || 'User',
    lastName:
      family_name || (namesSplit.length > 1 ? namesSplit[namesSplit.length - 1] : '') || 'User',
    email: email.toLowerCase(),
    googleId: sub,
    avatar: picture || '',
    'auth.refreshTokenJTI': JTI,
    'auth.roles': [{ roleId: customerRole._id, slug: customerRole.slug }],
    'auth.permissions': customerRole.permissions || [],
    'auth.lastLogin': new Date(),
    accountStatus: email_verified ? 'active' : 'unverified',
    ...(email_verified && {
      'kyc.email.isVerified': true,
      'kyc.email.data': { verifiedAt: new Date() },
    }),
  });

  // Create tokens
  await createAuthTokens(req, newUser, 'client', JTI);

  // Fetch the created user with unselected fields
  const createdUser = await User.findById(newUser._id)
    .select(unselectedFields.join(' '))
    .lean<ModelUser>();

  if (!createdUser) {
    throw new AppError('Failed to create user', 500);
  }

  return createdUser;
}

// Login an existing user with Google OAuth
async function userLogin(req: NextRequest, dbUser: ModelUser, sub: string): Promise<ModelUser> {
  // Check account status
  if (dbUser.accountStatus === 'suspended') {
    throw new AppError('Your account has been suspended', 403);
  }

  if (dbUser.accountStatus === 'deleted') {
    throw new AppError('Account not found', 401);
  }

  // Update googleId if not set
  if (!dbUser.googleId && sub) {
    await User.findByIdAndUpdate(dbUser._id, { googleId: sub });
  }

  // Generate JTI for tokens
  const JTI = await createAuthTokens(req, dbUser, 'client', generateRandomString(16, 'JTI'));

  // Update user with new JTI and last login
  const updatedUser = await User.findByIdAndUpdate(
    dbUser._id,
    {
      'auth.refreshTokenJTI': JTI,
      'auth.lastLogin': new Date(),
    },
    { new: true }
  )
    .select(unselectedFields.join(' '))
    .lean<ModelUser>();

  if (!updatedUser) {
    throw new AppError('Failed to sign in', 500);
  }

  return updatedUser;
}
