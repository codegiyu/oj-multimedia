/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ISiteSettings,
  IAdmin,
  IUser,
  UploadIntent,
  EntityType,
} from '@/app/_server/lib/types/constants';
import mongoose from 'mongoose';

export type HttpMethods = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

/**
 * Utility type that converts backend-oriented types to client-friendly types.
 * Converts:
 * - mongoose.Types.ObjectId -> string
 * - Date -> string
 * Recursively applies to nested objects and arrays.
 * Preserves optional (undefined) and null types appropriately.
 */
export type ClientFriendly<T> = T extends mongoose.Types.ObjectId
  ? string
  : T extends Date
    ? string
    : T extends (infer U)[]
      ? ClientFriendly<U>[]
      : T extends readonly (infer U)[]
        ? readonly ClientFriendly<U>[]
        : T extends Record<string, any>
          ? {
              [K in keyof T]: ClientFriendly<T[K]>;
            }
          : T;

// Client-friendly type aliases for backend types
export type ClientSiteSettings = ClientFriendly<ISiteSettings>;
export type ClientAdmin = ClientFriendly<IAdmin>;
export type ClientUser = ClientFriendly<IUser>;

export type EndpointDefinition<
  Payload extends Record<string, any> | undefined = undefined,
  Response = unknown,
  Query extends string | undefined = undefined,
> = Query extends undefined
  ? Payload extends undefined
    ? { payload?: never; query?: never; response: Response }
    : { payload: Payload; query?: never; response: Response }
  : Query extends `${string}` | undefined
    ? Payload extends undefined
      ? { payload?: never; query?: Query; response: Response }
      : { payload: Payload; query?: Query; response: Response }
    : Payload extends undefined
      ? { payload?: never; query: Query; response: Response }
      : { payload: Payload; query: Query; response: Response };

export type EndpointDetails = {
  path: `/${string}`;
  method: HttpMethods;
  isNotAuthenticated?: boolean;
};

export interface AllEndpoints {
  // Authentication
  AUTH_LOGIN: EndpointDefinition<IAuthLoginPayload, IAuthLoginRes, undefined>;
  AUTH_GOOGLE_LOGIN: EndpointDefinition<IAuthGoogleLoginPayload, IAuthGoogleLoginRes, undefined>;
  AUTH_LOGOUT: EndpointDefinition<undefined, { success: boolean }, undefined>;
  AUTH_SESSION: EndpointDefinition<undefined, IAuthSessionRes, undefined>;

  // File Upload (Public)
  GENERATE_PRESIGNED_URL: EndpointDefinition<
    IUploadPresignedUrlPayload,
    IUploadPresignedUrlRes,
    undefined
  >;

  // File Upload (Admin)
  ADMIN_GENERATE_PRESIGNED_URL: EndpointDefinition<
    IUploadPresignedUrlPayload,
    IUploadPresignedUrlRes,
    undefined
  >;

  // Site Settings (Public)
  GET_SITE_SETTINGS: EndpointDefinition<
    undefined,
    ClientSiteSettings | Partial<ClientSiteSettings>,
    `/${string}`
  >;

  // Site Settings (Admin)
  ADMIN_UPDATE_SITE_SETTINGS: EndpointDefinition<
    ISiteSettingsUpdatePayload,
    Partial<ClientSiteSettings>,
    undefined
  >;
}

export const ENDPOINTS: Record<keyof AllEndpoints, EndpointDetails> = {
  // Authentication
  AUTH_LOGIN: {
    path: '/auth/login',
    method: 'POST',
    isNotAuthenticated: true,
  },
  AUTH_GOOGLE_LOGIN: {
    path: '/auth/google-login',
    method: 'POST',
    isNotAuthenticated: true,
  },
  AUTH_LOGOUT: {
    path: '/auth/logout',
    method: 'POST',
  },
  AUTH_SESSION: {
    path: '/auth/session',
    method: 'GET',
  },

  // File Upload (Public)
  GENERATE_PRESIGNED_URL: {
    path: '/upload/presigned-url',
    method: 'POST',
    isNotAuthenticated: true,
  },

  // File Upload (Admin)
  ADMIN_GENERATE_PRESIGNED_URL: {
    path: '/admin/upload/presigned-url',
    method: 'POST',
  },

  // Site Settings (Public)
  GET_SITE_SETTINGS: {
    path: '/site-settings', // /:slice
    method: 'GET',
    isNotAuthenticated: true,
  },

  // Site Settings (Admin)
  ADMIN_UPDATE_SITE_SETTINGS: {
    path: '/admin/site-settings',
    method: 'PATCH',
  },
};

// Pagination Query Type
export type PageAndSizeQuery =
  | `?page=${number}&limit=${number}`
  | `?page=${number}`
  | `?limit=${number}`
  | `?${string}`;

// List Response Types
export type GetListRes<T, Name extends string> = {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
} & Record<Name, T[]>;

// Reorder Payloads (generic for any entity with displayOrder)
export interface IReorderPayload {
  reorderItems: Array<{
    id: string;
    displayOrder: number;
  }>;
}

export interface IReorderRes {
  modifiedCount: number;
  matchedCount: number;
}

// File Upload Payloads
export interface IUploadPresignedUrlPayloadBase {
  entityType?: EntityType;
  entityId?: string;
  intent?: UploadIntent;
  fileExtension?: string;
  contentType?: string;
  files?: Array<{
    fileExtension: string;
    contentType: string;
  }>;
}

export type IUploadPresignedUrlPayload =
  | (IUploadPresignedUrlPayloadBase & {
      // if single file, this is returned
      entityType: EntityType;
      entityId: string;
      intent: UploadIntent;
      fileExtension: string;
      contentType: string;
      files?: never;
    })
  | (IUploadPresignedUrlPayloadBase & {
      // if multiple files, this is returned
      entityType: EntityType;
      entityId: string;
      intent: UploadIntent;
      files: Array<{
        fileExtension: string;
        contentType: string;
      }>;
      fileExtension?: never;
      contentType?: never;
    });

export interface IUploadPresignedUrlResBase {
  uploadUrl?: string;
  key?: string;
  intent?: string;
  publicUrl?: string;
  documentId?: string;
  filename?: string;
  expiresIn?: number;
  expiresAt?: string;
  uploads?: Array<{
    intent: string;
    uploadUrl: string;
    key: string;
    publicUrl: string;
    documentId?: string;
    filename?: string;
    expiresAt?: string;
    expiresIn: number;
  }>;
  count?: number;
}

export type IUploadPresignedUrlRes =
  | (IUploadPresignedUrlResBase & {
      // if single file, this is returned
      uploadUrl: string;
      key: string;
      filename?: string;
      expiresAt?: string;
      intent: string;
      publicUrl: string;
      documentId?: string;
      expiresIn: number;
      uploads?: never;
      count?: never;
    })
  | (IUploadPresignedUrlResBase & {
      // if multiple files, this is returned
      uploads: Array<{
        intent: string;
        uploadUrl: string;
        key: string;
        filename?: string;
        expiresAt?: string;
        publicUrl: string;
        documentId?: string;
        expiresIn: number;
      }>;
      count: number;
      uploadUrl?: never;
      key?: never;
      intent?: never;
      filename?: never;
      expiresAt?: never;
      publicUrl?: never;
      documentId?: never;
      expiresIn?: never;
    });

// Site Settings Payloads
export interface ISiteSettingsUpdatePayload {
  settingsPayload: Array<{
    name:
      | 'appDetails'
      | 'seo'
      | 'legal'
      | 'email'
      | 'features'
      | 'analytics'
      | 'localization'
      | 'branding'
      | 'contactInfo'
      | 'socials';
    value: any; // The value structure depends on the slice name
  }>;
}

// Authentication Payloads
export interface IAuthLoginPayload {
  email: string;
  password: string;
}

export interface IAuthLoginRes {
  user: ClientAdmin;
}

export interface IAuthGoogleLoginPayload {
  googleCode: string;
}

export interface IAuthGoogleLoginRes {
  user: ClientUser;
}

export interface IAuthSessionRes {
  user: ClientAdmin | ClientUser | null;
}
