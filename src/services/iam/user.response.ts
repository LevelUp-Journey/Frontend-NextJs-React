// IAM Response Interfaces - API Contract Definitions
// These interfaces define the shape of data coming from the API

import { LoginProvider } from './user.entity';

/**
 * Generic API Response Wrapper
 */
export interface ApiResponse<T = unknown> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
    details?: {
        field?: string;
        code?: string;
    };
}

/**
 * User Response from API - Raw data structure
 */
export interface UserResponse {
    id: string;
    username: string;
    email: string;
    displayName?: string | null;
    avatarUrl?: string | null;
    loginProvider: LoginProvider;
    hasPassword: boolean;
    createdAt: string; // ISO string from API
    updatedAt: string; // ISO string from API
}

/**
 * Authentication Response from API
 */
export interface AuthenticationResponse {
    user: UserResponse;
    token?: string;
    refreshToken?: string;
}

/**
 * Profile Response from API - Simplified user data
 */
export interface ProfileResponse {
    id: string;
    username: string;
    email: string;
    displayName?: string | null;
    avatarUrl?: string | null;
}

/**
 * Password Change Response
 */
export interface PasswordChangeResponse {
    success: boolean;
    message?: string;
}

/**
 * Username Change Response
 */
export interface UsernameChangeResponse {
    success: boolean;
    newUsername: string;
}

/**
 * Profile Update Response
 */
export interface ProfileUpdateResponse {
    id: string;
    username: string;
    email: string;
    displayName?: string | null;
    avatarUrl?: string | null;
    updatedAt: string;
}

// Helper function for creating error responses
export const createErrorResponse = (
    error: string, 
    message?: string, 
    field?: string, 
    code?: string
): ApiResponse => ({
    success: false,
    error,
    message,
    details: field && code ? { field, code } : undefined
});

export const createSuccessResponse = <T>(data: T): ApiResponse<T> => ({
    success: true,
    data
});
