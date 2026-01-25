import { Admin } from '../../models/admin';
import { Role } from '../../models/role';
import { SiteSettings } from '../../models/siteSettings';
import { IAdmin, Permission } from '../types/constants';
import { AppError } from '../utils/appError';
import { createBcryptHash, generateRandomString, getRoleWithSlug } from '../utils/helpers';
import { logger } from '../utils/logger';
import { addToCache } from '../utils/redis';
import { ALL_ADMIN_PERMISSIONS, BASIC_ADMIN_PERMISSION_SLUGS } from '../types/contacts';

const SUPER_ADMIN_PERMISSIONS = ALL_ADMIN_PERMISSIONS;

const BASIC_ADMIN_PERMISSIONS = ALL_ADMIN_PERMISSIONS.filter((permission: Permission) =>
  BASIC_ADMIN_PERMISSION_SLUGS.includes(permission.slug as string)
);

export const ROLES_DATA = [
  {
    name: 'Super Admin',
    description: 'Super Admin Role',
    slug: 'super-admin',
    permissions: [...SUPER_ADMIN_PERMISSIONS],
  },
  {
    name: 'Admin',
    description: 'Admin Role',
    slug: 'admin',
    permissions: [...BASIC_ADMIN_PERMISSIONS],
  },
  {
    name: 'Customer',
    description: 'Customer Role',
    slug: 'customer',
    permissions: [],
  },
];

export const DEFAULT_SUPER_ADMIN: Omit<IAdmin, '_id' | 'auth' | 'createdAt' | 'updatedAt'> = {
  firstName: 'Super',
  lastName: 'Admin',
  email: 'codegiyu@gmail.com',
  accountStatus: 'active',
};

export const ROLE_SLUGS = ['super-admin', 'admin', 'customer'] as const;
export type RoleSlug = (typeof ROLE_SLUGS)[number];

export const seedRolesAndPermissions = async () => {
  for (const role of ROLES_DATA) {
    // create role if not exists
    const rawResult = await Role.findOneAndUpdate(
      { slug: role.slug },
      {
        $set: {
          name: role.name,
          description: role.description,
          permissions: (role.permissions || []).map(p => ({
            name: p.name,
            description: p.description,
            slug: p.slug,
            isRestricted: p.isRestricted,
          })),
        },
        $setOnInsert: {
          slug: role.slug,
          // any fields you want initialized only on insert
        },
      },
      {
        upsert: true,
        new: true,
        includeResultMetadata: true,
        runValidators: true, // validate against schema
        setDefaultsOnInsert: true, // apply schema defaults on insert
        context: 'query', // useful for some validators that need query context
      }
    );

    if (!rawResult || !rawResult.value) continue;
    const createdRole = rawResult.value.toObject();

    logger.info(
      `${createdRole.slug} role ${rawResult.lastErrorObject?.updatedExisting ? 'updated' : 'created'}`
    );
    addToCache(`oj-pers:roleKeys:${role.slug}`, JSON.stringify(createdRole));
  }
};

export const seedSuperAdmin = async () => {
  const hashedPassword = await createBcryptHash('Password123');
  const JTI = generateRandomString(16, 'JTI');
  const superAdminRole = await getRoleWithSlug('super-admin');

  if (!superAdminRole) {
    throw new AppError('Error seeding super admin: Super Admin role not found', 500);
  }

  // create superadmin if not exists
  const rawResult = await Admin.findOneAndUpdate(
    { email: DEFAULT_SUPER_ADMIN.email },
    {
      $set: {
        'auth.refreshTokenJTI': JTI,
        'auth.roles': [{ roleId: superAdminRole._id, slug: superAdminRole.slug }],
        'auth.permissions': (superAdminRole.permissions || []).map(permission => ({
          slug: permission.slug,
          name: permission.name,
          description: permission.description,
          isRestricted: permission.isRestricted,
        })),
        'auth.lastLogin': new Date(),
      },
      $setOnInsert: {
        firstName: DEFAULT_SUPER_ADMIN.firstName,
        lastName: DEFAULT_SUPER_ADMIN.lastName,
        email: DEFAULT_SUPER_ADMIN.email,
        accountStatus: DEFAULT_SUPER_ADMIN.accountStatus,
        'auth.password.value': hashedPassword,
      },
    },
    {
      upsert: true,
      new: true,
      includeResultMetadata: true,
      runValidators: true, // validate against schema
      setDefaultsOnInsert: true, // apply schema defaults on insert
      context: 'query', // useful for some validators that need query context
    }
  );

  if (!rawResult || !rawResult.value) {
    throw new AppError('Error seeding superAdmin: findOneAndUpdate failed!', 500);
  }

  // const superAdmin = rawResult.value.toObject();

  logger.info(
    `Super Admin account ${rawResult.lastErrorObject?.updatedExisting ? 'updated' : 'created'}`
  );
};

export const updateCacheToken = async () => {
  // if (ENVIRONMENT.APP.ENV === 'production') {
  //   const users = await Customer.find({
  //     email: { $in: administrators },
  //   });
  //   if (users.length !== administrators.length) return console.log('One or more users not found');
  //   for (const user of users) {
  //     let key: CacheKey = `oj-pers:xxx`;
  //     switch (user.email) {
  //       case 'codegiyu@gmail.com':
  //         key = 'oj-pers:dev:token' as CacheKey;
  //         break;
  //       default:
  //         console.log(`No cache key defined for ${user.email}`);
  //         continue;
  //     }
  //     await removeFromCache(key);
  //     await persistentRedis.set(key, user.auth.pushToken);
  //   }
  // }
};

// Seed functions

export const seedSiteSettings = async () => {
  const defaultSettings = {
    name: 'settings',
    appDetails: {
      logo: '/images/logo.png',
      appName: 'OJ Multimedia',
      description:
        'Your trusted source for gospel music, inspiring sermons, daily devotionals, and Christian resources to strengthen your faith journey.',
    },
    seo: {
      metaTitleTemplate: '%s | OHEJUIRA',
      metaDescription:
        'OHEJUIRA is a Christian-based multimedia platform offering gospel music downloads, inspirational music, sermons, devotionals, gospel news, resources, promotional services, and a vendor marketplace. Serving humanity through innovation in entertainment and technology.',
      keywords: [
        'OHEJUIRA',
        'OHEJUIRA-Multimedia',
        'Gospel Music',
        'Inspirational Music',
        'Christian Sermons',
        'Daily Devotionals',
        'Gospel News',
        'Christian Resources',
        'Prayer Requests',
        'Bible Study',
        'Christian Community',
        'Gospel Artists',
        'Pastors',
        'Christian Blog',
        'Faith Resources',
        'Spiritual Growth',
        'Christian Content',
        'Multimedia Platform',
        'Content Creation',
        'Production Services',
      ],
      ogImageUrl: '/og-image.png',
      faviconUrl: '/favicon.ico',
      canonicalUrlBase: process.env.APP_URL || 'https://ojmultimedia.com',
      robotsIndex: true,
      robotsFollow: true,
    },
    legal: {
      termsOfServiceUrl: '/terms-and-conditions',
      privacyPolicyUrl: '/privacy-policy',
      cookiePolicyUrl: '',
      disclaimerText: '',
    },
    email: {
      fromEmail: 'ohemultimedia@gmail.com',
      fromName: 'OHEJUIRA',
      replyToEmail: 'ohemultimedia@gmail.com',
    },
    features: {
      maintenanceMode: false,
      registrationEnabled: true,
      loginEnabled: true,
    },
    analytics: {
      googleAnalyticsId: '',
      facebookPixelId: '',
      otherTrackingIds: [],
    },
    localization: {
      defaultLanguage: 'en',
      supportedLanguages: ['en'],
      defaultTimezone: 'Africa/Lagos',
      defaultCurrency: 'NGN',
    },
    branding: {
      faviconUrl: '/favicon.ico',
      primaryBrandColor: '#2563EB',
      secondaryBrandColor: '#404040',
    },
    contactInfo: {
      address: [],
      tel: ['+234 705 692 3436', '+234 913 667 0466', '+234 707 324 4801'],
      email: ['ohemultimedia@gmail.com'],
      whatsapp: '',
      locationUrl: '',
      officeHours: {
        monday: { start: '09:00', end: '17:00' },
        tuesday: { start: '09:00', end: '17:00' },
        wednesday: { start: '09:00', end: '17:00' },
        thursday: { start: '09:00', end: '17:00' },
        friday: { start: '09:00', end: '17:00' },
        saturday: null,
        sunday: null,
      },
    },
    socials: [
      {
        platform: 'youtube',
        href: 'https://youtube.com/@ojm-p9h?si=Ag6UH4fk3M437kfg',
      },
      {
        platform: 'facebook',
        href: 'https://web.facebook.com/profile.php?id=61570489011885&sk=photos',
      },
    ],
  };

  const rawResult = await SiteSettings.findOneAndUpdate(
    { name: 'settings' },
    {
      $set: {
        appDetails: defaultSettings.appDetails,
        seo: defaultSettings.seo,
        legal: defaultSettings.legal,
        email: defaultSettings.email,
        features: defaultSettings.features,
        analytics: defaultSettings.analytics,
        localization: defaultSettings.localization,
        branding: defaultSettings.branding,
        contactInfo: defaultSettings.contactInfo,
        socials: defaultSettings.socials,
      },
      $setOnInsert: {
        name: defaultSettings.name,
      },
    },
    {
      upsert: true,
      new: true,
      includeResultMetadata: true,
      runValidators: true,
      setDefaultsOnInsert: true,
      context: 'query',
    }
  );

  if (!rawResult || !rawResult.value) {
    throw new AppError('Error seeding site settings: findOneAndUpdate failed!', 500);
  }

  logger.info(
    `Site settings ${rawResult.lastErrorObject?.updatedExisting ? 'updated' : 'created'}`
  );
};

// Seed database with initial data
export const seedDb = async () => {
  // Add seed functions here
  // await seedRolesAndPermissions();
  // await seedSuperAdmin();
  // await seedSiteSettings();
};
