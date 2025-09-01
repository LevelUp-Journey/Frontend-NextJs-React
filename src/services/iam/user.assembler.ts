// User Assembler - Data Transformation Layer
// Converts between different data representations (Response -> Entity, Request validation)
// Following DDD principles for data transformation and validation

import {
    User,
    UserProfile,
    AuthenticationResult,
    validatePassword,
    validateUsername,
    validateEmail,
    validateDisplayName,
    validateAvatarUrl,
    DomainValidationError
} from './user.entity';

import {
    UserResponse,
    AuthenticationResponse,
    ProfileResponse,
    ProfileUpdateResponse
} from './user.response';

import {
    SignUpRequest,
    SignInRequest,
    ChangePasswordRequest,
    ChangeUsernameRequest,
    UpdateProfileRequest
} from './user.request';

/**
 * User Assembler - Transforms data between layers
 */
export class UserAssembler {
    /**
     * Convert API UserResponse to Domain User Entity
     */
    static toUserEntity(response: UserResponse): User {
        return {
            id: response.id,
            username: response.username,
            email: response.email,
            displayName: response.displayName,
            avatarUrl: response.avatarUrl,
            loginProvider: response.loginProvider,
            hasPassword: response.hasPassword,
            createdAt: new Date(response.createdAt),
            updatedAt: new Date(response.updatedAt)
        };
    }

    /**
     * Convert API AuthenticationResponse to Domain AuthenticationResult Entity
     */
    static toAuthenticationResult(response: AuthenticationResponse): AuthenticationResult {
        return {
            user: this.toUserEntity(response.user),
            token: response.token,
            refreshToken: response.refreshToken
        };
    }

    /**
     * Convert API ProfileResponse to Domain UserProfile Entity
     */
    static toUserProfile(response: ProfileResponse): UserProfile {
        return {
            id: response.id,
            username: response.username,
            email: response.email,
            displayName: response.displayName,
            avatarUrl: response.avatarUrl
        };
    }

    /**
     * Convert ProfileUpdateResponse to UserProfile Entity
     */
    static profileUpdateResponseToUserProfile(response: ProfileUpdateResponse): UserProfile {
        return {
            id: response.id,
            username: response.username,
            email: response.email,
            displayName: response.displayName,
            avatarUrl: response.avatarUrl
        };
    }

    /**
     * Validate and prepare SignUpRequest
     * Throws DomainValidationError if validation fails
     */
    static validateSignUpRequest(request: SignUpRequest): SignUpRequest {
        validateEmail(request.email);
        validateUsername(request.username);
        validatePassword(request.password);
        
        return request;
    }

    /**
     * Validate and prepare SignInRequest
     * Throws DomainValidationError if validation fails
     */
    static validateSignInRequest(request: SignInRequest): SignInRequest {
        // Validate emailOrUsername is not empty
        if (!request.emailOrUsername?.trim()) {
            throw new DomainValidationError(
                'emailOrUsername',
                'REQUIRED',
                'Email or username is required'
            );
        }

        // Validate password is not empty
        if (!request.password) {
            throw new DomainValidationError(
                'password',
                'REQUIRED',
                'Password is required'
            );
        }

        return request;
    }

    /**
     * Validate and prepare ChangePasswordRequest
     * Throws DomainValidationError if validation fails
     */
    static validateChangePasswordRequest(request: ChangePasswordRequest): ChangePasswordRequest {
        validatePassword(request.newPassword);
        
        // If currentPassword is provided, validate it's not empty
        if (request.currentPassword !== undefined && !request.currentPassword) {
            throw new DomainValidationError(
                'currentPassword',
                'INVALID',
                'Current password cannot be empty when provided'
            );
        }

        return request;
    }

    /**
     * Validate and prepare ChangeUsernameRequest
     * Throws DomainValidationError if validation fails
     */
    static validateChangeUsernameRequest(request: ChangeUsernameRequest): ChangeUsernameRequest {
        validateUsername(request.newUsername);
        return request;
    }

    /**
     * Validate and prepare UpdateProfileRequest
     * Throws DomainValidationError if validation fails
     */
    static validateUpdateProfileRequest(request: UpdateProfileRequest): UpdateProfileRequest {
        validateDisplayName(request.displayName);
        validateAvatarUrl(request.avatarUrl);
        return request;
    }

    /**
     * Legacy method for backward compatibility
     * @deprecated Use validateSignUpRequest instead
     */
    static toUserCredentials(request: SignUpRequest): SignUpRequest {
        return this.validateSignUpRequest(request);
    }
}

/**
 * Validation Helper Functions
 */
export class ValidationHelper {
    /**
     * Check if a user has a local password (not OAuth-only)
     */
    static hasLocalPassword(user: User): boolean {
        return user.hasPassword;
    }

    /**
     * Check if user is OAuth-only (no local password)
     */
    static isOAuthOnly(user: User): boolean {
        return !user.hasPassword && user.loginProvider !== 'email';
    }

    /**
     * Validate if current password is required for password change
     */
    static isCurrentPasswordRequired(user: User): boolean {
        // If user has a local password, current password is required
        // If user is OAuth-only and setting password for first time, current password is not required
        return this.hasLocalPassword(user);
    }

    /**
     * Get validation error message based on field and error code
     */
    static getValidationMessage(field: string, code: string): string {
        const messages: Record<string, Record<string, string>> = {
            password: {
                INVALID_LENGTH: `Password must be between 8 and 40 characters`,
                INVALID_COMPLEXITY: `Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character (@$!%*?&)`
            },
            username: {
                INVALID_LENGTH: `Username must be between 3 and 20 characters`,
                INVALID_FORMAT: `Username can only contain letters, numbers, dots, underscores, and hyphens`
            },
            email: {
                INVALID_LENGTH: `Email must not exceed 100 characters`,
                INVALID_FORMAT: `Email must be a valid email address`
            },
            displayName: {
                INVALID_LENGTH: `Display name must not exceed 20 characters`
            },
            avatarUrl: {
                INVALID_LENGTH: `Avatar URL must not exceed 200 characters`,
                INVALID_PROTOCOL: `Avatar URL must use HTTP or HTTPS protocol`,
                INVALID_DOMAIN: `Avatar URL must include a valid domain with extension`,
                INVALID_URL: `Avatar URL must be a valid URL`
            }
        };

        return messages[field]?.[code] || `Invalid ${field}`;
    }
}
