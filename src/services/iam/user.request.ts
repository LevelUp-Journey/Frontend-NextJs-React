// IAM Request Interfaces - API Input Definitions
// These interfaces define the shape of data sent to the API

/**
 * Sign In Request - User authentication
 */
export interface SignInRequest {
    emailOrUsername: string;
    password: string;
}

/**
 * Sign Up Request - User registration
 */
export interface SignUpRequest {
    email: string;
    username: string;
    password: string;
}

/**
 * Password Change Request
 * currentPassword is optional for OAuth users who haven't set a password yet
 */
export interface ChangePasswordRequest {
    currentPassword?: string;
    newPassword: string;
}

/**
 * Username Change Request
 */
export interface ChangeUsernameRequest {
    newUsername: string;
}

/**
 * Profile Update Request
 */
export interface UpdateProfileRequest {
    displayName?: string | null;
    avatarUrl?: string | null;
}

/**
 * OAuth Callback Request
 */
export interface OAuthCallbackRequest {
    code: string;
    state?: string;
    provider: 'google' | 'github';
}

/**
 * Password Reset Request
 */
export interface PasswordResetRequest {
    email: string;
}

/**
 * Password Reset Confirmation Request
 */
export interface PasswordResetConfirmRequest {
    token: string;
    newPassword: string;
}

/**
 * Email Verification Request
 */
export interface EmailVerificationRequest {
    token: string;
}

/**
 * Refresh Token Request
 */
export interface RefreshTokenRequest {
    refreshToken: string;
}
