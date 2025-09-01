"use server";

// IAM Actions - Application Service Layer
// Implements business logic and validation for user authentication and management
// This layer orchestrates domain services and external API calls
// Follows DDD principles with proper error handling and validation

import { UserController } from './user.controller';
import { UserAssembler } from './user.assembler';

// Import Request interfaces
import {
    SignUpRequest,
    SignInRequest,
    ChangePasswordRequest,
    ChangeUsernameRequest,
    UpdateProfileRequest
} from './user.request';

// Import Response interfaces
import {
    ApiResponse,
    AuthenticationResponse,
    ProfileResponse
} from './user.response';

// Import Domain entities and validation
import {
    DomainValidationError,
    validatePassword,
    validateUsername,
    validateEmail,
    validateDisplayName,
    validateAvatarUrl
} from './user.entity';

// Authentication Actions

/**
 * Register a new user with email and password
 * Validates all input according to domain rules before submitting
 */
export async function signUpAction(request: SignUpRequest): Promise<ApiResponse<AuthenticationResponse>> {
    try {
        // Client-side validation using domain rules
        UserAssembler.validateSignUpRequest(request);
        
        // Call API through controller
        const response = await UserController.signUp(request);
        
        if (!response.success) {
            return response;
        }

        return response;
    } catch (error) {
        if (error instanceof DomainValidationError) {
            return {
                success: false,
                error: 'VALIDATION_ERROR',
                message: error.message,
                details: {
                    field: error.field,
                    code: error.code
                }
            };
        }

        return {
            success: false,
            error: 'UNKNOWN_ERROR',
            message: 'Failed to register user'
        };
    }
}

/**
 * Sign in user with email/username and password
 */
export async function signInAction(request: SignInRequest): Promise<ApiResponse<AuthenticationResponse>> {
    try {
        // Basic input validation
        UserAssembler.validateSignInRequest(request);
        
        // Call API through controller
        const response = await UserController.signIn(request);

        return response;
    } catch {
        return {
            success: false,
            error: 'UNKNOWN_ERROR',
            message: 'Failed to sign in'
        };
    }
}

/**
 * Sign out current user
 */
export async function signOutAction(): Promise<ApiResponse<void>> {
    try {
        const response = await UserController.signOut();
        return response;
    } catch {
        return {
            success: false,
            error: 'UNKNOWN_ERROR',
            message: 'Failed to sign out'
        };
    }
}

/**
 * Change user password
 * Validates new password and handles OAuth2 users (no current password required)
 */
export async function changePasswordAction(request: ChangePasswordRequest): Promise<ApiResponse<void>> {
    try {
        // Validate new password using domain rules
        UserAssembler.validateChangePasswordRequest(request);
        
        const response = await UserController.changePassword(request);
        return response;
    } catch (error) {
        if (error instanceof DomainValidationError) {
            return {
                success: false,
                error: 'VALIDATION_ERROR',
                message: error.message,
                details: {
                    field: error.field,
                    code: error.code
                }
            };
        }

        return {
            success: false,
            error: 'UNKNOWN_ERROR',
            message: 'Failed to change password'
        };
    }
}

/**
 * Change username
 * Validates new username according to domain rules
 */
export async function changeUsernameAction(request: ChangeUsernameRequest): Promise<ApiResponse<void>> {
    try {
        // Validate new username using domain rules
        UserAssembler.validateChangeUsernameRequest(request);
        
        const response = await UserController.changeUsername(request);
        return response;
    } catch (error) {
        if (error instanceof DomainValidationError) {
            return {
                success: false,
                error: 'VALIDATION_ERROR',
                message: error.message,
                details: {
                    field: error.field,
                    code: error.code
                }
            };
        }

        return {
            success: false,
            error: 'UNKNOWN_ERROR',
            message: 'Failed to change username'
        };
    }
}

// Profile Management Actions

/**
 * Get current user profile
 */
export async function getProfileAction(): Promise<ApiResponse<ProfileResponse>> {
    try {
        const response = await UserController.getProfile();
        return response;
    } catch {
        return {
            success: false,
            error: 'UNKNOWN_ERROR',
            message: 'Failed to retrieve profile'
        };
    }
}

/**
 * Update user profile (display name and avatar)
 * Validates profile data according to domain rules
 */
export async function updateProfileAction(request: UpdateProfileRequest): Promise<ApiResponse<ProfileResponse>> {
    try {
        // Validate profile data using domain rules
        UserAssembler.validateUpdateProfileRequest(request);
        
        const response = await UserController.updateProfile(request);
        return response;
    } catch (error) {
        if (error instanceof DomainValidationError) {
            return {
                success: false,
                error: 'VALIDATION_ERROR',
                message: error.message,
                details: {
                    field: error.field,
                    code: error.code
                }
            };
        }

        return {
            success: false,
            error: 'UNKNOWN_ERROR',
            message: 'Failed to update profile'
        };
    }
}

/**
 * Get current authenticated user details
 */
export async function getCurrentUserAction(): Promise<ApiResponse<AuthenticationResponse>> {
    try {
        const response = await UserController.getCurrentUser();
        return response;
    } catch {
        return {
            success: false,
            error: 'UNKNOWN_ERROR',
            message: 'Failed to retrieve user information'
        };
    }
}

/**
 * Delete user account
 */
export async function deleteAccountAction(): Promise<ApiResponse<void>> {
    try {
        const response = await UserController.deleteAccount();
        return response;
    } catch {
        return {
            success: false,
            error: 'UNKNOWN_ERROR',
            message: 'Failed to delete account'
        };
    }
}

// OAuth2 Actions

/**
 * Initiate Google OAuth flow
 */
export async function initiateGoogleOAuthAction(redirectUri: string): Promise<ApiResponse<{ authUrl: string }>> {
    try {
        if (!redirectUri?.trim()) {
            return {
                success: false,
                error: 'VALIDATION_ERROR',
                message: 'Redirect URI is required',
                details: {
                    field: 'redirectUri',
                    code: 'REQUIRED_FIELD'
                }
            };
        }

        const response = await UserController.initiateGoogleOAuth(redirectUri);
        return response;
    } catch {
        return {
            success: false,
            error: 'UNKNOWN_ERROR',
            message: 'Failed to initiate Google OAuth'
        };
    }
}

/**
 * Handle Google OAuth callback
 */
export async function handleGoogleOAuthCallbackAction(code: string, state?: string): Promise<ApiResponse<AuthenticationResponse>> {
    try {
        if (!code?.trim()) {
            return {
                success: false,
                error: 'VALIDATION_ERROR',
                message: 'Authorization code is required',
                details: {
                    field: 'code',
                    code: 'REQUIRED_FIELD'
                }
            };
        }

        const response = await UserController.handleGoogleOAuthCallback({
            code,
            state,
            provider: 'google'
        });
        
        return response;
    } catch {
        return {
            success: false,
            error: 'UNKNOWN_ERROR',
            message: 'Failed to handle Google OAuth callback'
        };
    }
}

/**
 * Initiate GitHub OAuth flow
 */
export async function initiateGitHubOAuthAction(redirectUri: string): Promise<ApiResponse<{ authUrl: string }>> {
    try {
        if (!redirectUri?.trim()) {
            return {
                success: false,
                error: 'VALIDATION_ERROR',
                message: 'Redirect URI is required',
                details: {
                    field: 'redirectUri',
                    code: 'REQUIRED_FIELD'
                }
            };
        }

        const response = await UserController.initiateGitHubOAuth(redirectUri);
        return response;
    } catch {
        return {
            success: false,
            error: 'UNKNOWN_ERROR',
            message: 'Failed to initiate GitHub OAuth'
        };
    }
}

/**
 * Handle GitHub OAuth callback
 */
export async function handleGitHubOAuthCallbackAction(code: string, state?: string): Promise<ApiResponse<AuthenticationResponse>> {
    try {
        if (!code?.trim()) {
            return {
                success: false,
                error: 'VALIDATION_ERROR',
                message: 'Authorization code is required',
                details: {
                    field: 'code',
                    code: 'REQUIRED_FIELD'
                }
            };
        }

        const response = await UserController.handleGitHubOAuthCallback({
            code,
            state,
            provider: 'github'
        });
        
        return response;
    } catch {
        return {
            success: false,
            error: 'UNKNOWN_ERROR',
            message: 'Failed to handle GitHub OAuth callback'
        };
    }
}

// Token Management Actions

/**
 * Refresh authentication token
 */
export async function refreshTokenAction(refreshToken: string): Promise<ApiResponse<AuthenticationResponse>> {
    try {
        if (!refreshToken?.trim()) {
            return {
                success: false,
                error: 'VALIDATION_ERROR',
                message: 'Refresh token is required',
                details: {
                    field: 'refreshToken',
                    code: 'REQUIRED_FIELD'
                }
            };
        }

        const response = await UserController.refreshToken(refreshToken);
        return response;
    } catch {
        return {
            success: false,
            error: 'UNKNOWN_ERROR',
            message: 'Failed to refresh token'
        };
    }
}

/**
 * Validate current authentication token
 */
export async function validateTokenAction(): Promise<ApiResponse<{ valid: boolean; user?: ProfileResponse }>> {
    try {
        const response = await UserController.validateToken();
        return response;
    } catch {
        return {
            success: false,
            error: 'UNKNOWN_ERROR',
            message: 'Failed to validate token'
        };
    }
}

// Utility Actions for Client-Side Validation

/**
 * Client-side password validation
 * Useful for real-time form validation
 */
export async function validatePasswordAction(password: string): Promise<{ valid: boolean; error?: string }> {
    try {
        validatePassword(password);
        return { valid: true };
    } catch (error) {
        if (error instanceof DomainValidationError) {
            return { valid: false, error: error.message };
        }
        return { valid: false, error: 'Invalid password' };
    }
}

/**
 * Client-side username validation
 * Useful for real-time form validation
 */
export async function validateUsernameAction(username: string): Promise<{ valid: boolean; error?: string }> {
    try {
        validateUsername(username);
        return { valid: true };
    } catch (error) {
        if (error instanceof DomainValidationError) {
            return { valid: false, error: error.message };
        }
        return { valid: false, error: 'Invalid username' };
    }
}

/**
 * Client-side email validation
 * Useful for real-time form validation
 */
export async function validateEmailAction(email: string): Promise<{ valid: boolean; error?: string }> {
    try {
        validateEmail(email);
        return { valid: true };
    } catch (error) {
        if (error instanceof DomainValidationError) {
            return { valid: false, error: error.message };
        }
        return { valid: false, error: 'Invalid email' };
    }
}

/**
 * Client-side display name validation
 * Useful for real-time form validation
 */
export async function validateDisplayNameAction(displayName?: string): Promise<{ valid: boolean; error?: string }> {
    try {
        validateDisplayName(displayName);
        return { valid: true };
    } catch (error) {
        if (error instanceof DomainValidationError) {
            return { valid: false, error: error.message };
        }
        return { valid: false, error: 'Invalid display name' };
    }
}

/**
 * Client-side avatar URL validation
 * Useful for real-time form validation
 */
export async function validateAvatarUrlAction(avatarUrl?: string): Promise<{ valid: boolean; error?: string }> {
    try {
        validateAvatarUrl(avatarUrl);
        return { valid: true };
    } catch (error) {
        if (error instanceof DomainValidationError) {
            return { valid: false, error: error.message };
        }
        return { valid: false, error: 'Invalid avatar URL' };
    }
}
