// IAM Controller - HTTP Layer for User Management
// Implements all endpoints specified in the validation rules document
// Follows DDD principles with proper separation of concerns

import { http } from '@/services/axios';
import { AxiosResponse } from 'axios';

// Import Request interfaces
import {
    SignUpRequest,
    SignInRequest,
    ChangePasswordRequest,
    ChangeUsernameRequest,
    UpdateProfileRequest,
    OAuthCallbackRequest
} from './user.request';

// Import Response interfaces
import {
    ApiResponse,
    AuthenticationResponse,
    ProfileResponse,
    createErrorResponse
} from './user.response';

// Static Controller Class
export class UserController {
    private static readonly basePath = '/api/v1';

    // Authentication Endpoints
    
    /**
     * POST /api/v1/authentication/sign-up
     * Register a new user with email and password
     */
    static async signUp(request: SignUpRequest): Promise<ApiResponse<AuthenticationResponse>> {
        try {
            const response: AxiosResponse<AuthenticationResponse> = await http.post(
                `${this.basePath}/authentication/sign-up`,
                request
            );
            return { success: true, data: response.data };
        } catch (error) {
            return this.handleError(error);
        }
    }

    /**
     * POST /api/v1/authentication/sign-in
     * Authenticate user with email/username and password
     */
    static async signIn(request: SignInRequest): Promise<ApiResponse<AuthenticationResponse>> {
        try {
            const response: AxiosResponse<AuthenticationResponse> = await http.post(
                `${this.basePath}/authentication/sign-in`,
                request
            );
            return { success: true, data: response.data };
        } catch (error) {
            return this.handleError(error);
        }
    }

    /**
     * POST /api/v1/authentication/sign-out
     * Sign out the current user
     */
    static async signOut(): Promise<ApiResponse<void>> {
        try {
            await http.post(`${this.basePath}/authentication/sign-out`);
            return { success: true };
        } catch (error) {
            return this.handleError(error);
        }
    }

    /**
     * PUT /api/v1/authentication/password
     * Change user password (validates current password for local users)
     */
    static async changePassword(request: ChangePasswordRequest): Promise<ApiResponse<void>> {
        try {
            await http.put(`${this.basePath}/authentication/password`, request);
            return { success: true, message: 'Password updated successfully' };
        } catch (error) {
            return this.handleError(error);
        }
    }

    /**
     * PUT /api/v1/authentication/username
     * Change username (must be unique)
     */
    static async changeUsername(request: ChangeUsernameRequest): Promise<ApiResponse<void>> {
        try {
            await http.put(`${this.basePath}/authentication/username`, request);
            return { success: true, message: 'Username updated successfully' };
        } catch (error) {
            return this.handleError(error);
        }
    }

    // OAuth2 Endpoints

    /**
     * GET /api/v1/authentication/oauth/google
     * Initiate Google OAuth flow
     */
    static async initiateGoogleOAuth(redirectUri: string): Promise<ApiResponse<{ authUrl: string }>> {
        try {
            const response = await http.get(
                `${this.basePath}/authentication/oauth/google`,
                { params: { redirectUri } }
            );
            return { success: true, data: response.data };
        } catch (error) {
            return this.handleError(error);
        }
    }

    /**
     * POST /api/v1/authentication/oauth/google/callback
     * Handle Google OAuth callback
     */
    static async handleGoogleOAuthCallback(request: OAuthCallbackRequest): Promise<ApiResponse<AuthenticationResponse>> {
        try {
            const response: AxiosResponse<AuthenticationResponse> = await http.post(
                `${this.basePath}/authentication/oauth/google/callback`,
                request
            );
            return { success: true, data: response.data };
        } catch (error) {
            return this.handleError(error);
        }
    }

    /**
     * GET /api/v1/authentication/oauth/github
     * Initiate GitHub OAuth flow
     */
    static async initiateGitHubOAuth(redirectUri: string): Promise<ApiResponse<{ authUrl: string }>> {
        try {
            const response = await http.get(
                `${this.basePath}/authentication/oauth/github`,
                { params: { redirectUri } }
            );
            console.log("RESPONSE FROM GITHUB OAUTH INITIATE:", response.data);
            return { success: true, data: response.data };
        } catch (error) {
            return this.handleError(error);
        }
    }

    /**
     * POST /api/v1/authentication/oauth/github/callback
     * Handle GitHub OAuth callback
     */
    static async handleGitHubOAuthCallback(request: OAuthCallbackRequest): Promise<ApiResponse<AuthenticationResponse>> {
        try {
            const response: AxiosResponse<AuthenticationResponse> = await http.post(
                `${this.basePath}/authentication/oauth/github/callback`,
                request
            );
            return { success: true, data: response.data };
        } catch (error) {
            return this.handleError(error);
        }
    }

    // User Profile Endpoints

    /**
     * GET /api/v1/users/profile
     * Get current user profile
     */
    static async getProfile(): Promise<ApiResponse<ProfileResponse>> {
        try {
            const response: AxiosResponse<ProfileResponse> = await http.get(
                `${this.basePath}/users/profile`
            );
            return { success: true, data: response.data };
        } catch (error) {
            return this.handleError(error);
        }
    }

    /**
     * PUT /api/v1/users/profile
     * Update user profile (displayName, avatarUrl)
     */
    static async updateProfile(request: UpdateProfileRequest): Promise<ApiResponse<ProfileResponse>> {
        try {
            const response: AxiosResponse<ProfileResponse> = await http.put(
                `${this.basePath}/users/profile`,
                request
            );
            return { success: true, data: response.data, message: 'Profile updated successfully' };
        } catch (error) {
            return this.handleError(error);
        }
    }

    /**
     * GET /api/v1/users/me
     * Get current authenticated user details
     */
    static async getCurrentUser(): Promise<ApiResponse<AuthenticationResponse>> {
        try {
            const response: AxiosResponse<AuthenticationResponse> = await http.get(
                `${this.basePath}/users/me`
            );
            return { success: true, data: response.data };
        } catch (error) {
            return this.handleError(error);
        }
    }

    /**
     * DELETE /api/v1/users/account
     * Delete user account (soft delete)
     */
    static async deleteAccount(): Promise<ApiResponse<void>> {
        try {
            await http.delete(`${this.basePath}/users/account`);
            return { success: true, message: 'Account deleted successfully' };
        } catch (error) {
            return this.handleError(error);
        }
    }

    // Token Management

    /**
     * POST /api/v1/authentication/refresh
     * Refresh authentication token
     */
    static async refreshToken(refreshToken: string): Promise<ApiResponse<AuthenticationResponse>> {
        try {
            const response: AxiosResponse<AuthenticationResponse> = await http.post(
                `${this.basePath}/authentication/refresh`,
                { refreshToken }
            );
            return { success: true, data: response.data };
        } catch (error) {
            return this.handleError(error);
        }
    }

    /**
     * POST /api/v1/authentication/validate
     * Validate current token
     */
    static async validateToken(): Promise<ApiResponse<{ valid: boolean; user?: ProfileResponse }>> {
        try {
            const response = await http.post(`${this.basePath}/authentication/validate`);
            return { success: true, data: response.data };
        } catch (error) {
            return this.handleError(error);
        }
    }

    // Error Handling
    private static handleError<T = unknown>(error: unknown): ApiResponse<T> {
        // Handle axios HTTP errors
        if (error && typeof error === 'object' && 'isAxiosError' in error) {
            const axiosError = error as {
                isAxiosError: boolean;
                response?: {
                    status: number;
                    data: unknown;
                };
                message: string;
            };
            
            if (axiosError.response) {
                const status = axiosError.response.status;
                const data = axiosError.response.data;

                // Server returned structured error
                if (data && typeof data === 'object') {
                    const errorData = data as Record<string, unknown>;
                    return {
                        success: false,
                        error: (typeof errorData.error === 'string' ? errorData.error : `HTTP_${status}`),
                        message: (typeof errorData.message === 'string' ? errorData.message : axiosError.message),
                        details: (typeof errorData.details === 'object' ? errorData.details as { field?: string; code?: string } : undefined)
                    } as ApiResponse<T>;
                }

                // Map common HTTP status codes
                switch (status) {
                    case 400:
                        return createErrorResponse('BAD_REQUEST', 'Invalid request data') as ApiResponse<T>;
                    case 401:
                        return createErrorResponse('UNAUTHORIZED', 'Authentication required') as ApiResponse<T>;
                    case 403:
                        return createErrorResponse('FORBIDDEN', 'Access denied') as ApiResponse<T>;
                    case 404:
                        return createErrorResponse('NOT_FOUND', 'Resource not found') as ApiResponse<T>;
                    case 409:
                        return createErrorResponse('CONFLICT', 'Resource already exists') as ApiResponse<T>;
                    case 422:
                        return createErrorResponse('VALIDATION_ERROR', 'Validation failed') as ApiResponse<T>;
                    case 500:
                        return createErrorResponse('INTERNAL_ERROR', 'Internal server error') as ApiResponse<T>;
                    default:
                        return createErrorResponse(`HTTP_${status}`, axiosError.message) as ApiResponse<T>;
                }
            }

            // Network or other axios error
            return createErrorResponse('NETWORK_ERROR', 'Failed to connect to server') as ApiResponse<T>;
        }

        // Unknown error
        return createErrorResponse(
            'UNKNOWN_ERROR',
            error instanceof Error ? error.message : 'An unexpected error occurred'
        ) as ApiResponse<T>;
    }
}
