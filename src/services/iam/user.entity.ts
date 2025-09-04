// User Entity - Domain Model Interfaces
// Following DDD principles, entities represent domain concepts

/**
 * User Domain Entity
 * Represents a user in the system with all their attributes
 */
export interface User {
    id: string;
    username: string;
    email: string;
    displayName?: string | null;
    avatarUrl?: string | null;
    loginProvider: LoginProvider;
    hasPassword: boolean;
    createdAt: Date;
    updatedAt: Date;
}

/**
 * Authentication Provider Types
 */
export enum LoginProvider {
    GOOGLE = "google",
    EMAIL = "email",
    GITHUB = "github",
}

/**
 * User Profile Entity - Simplified view for profile operations
 */
export interface UserProfile {
    id: string;
    username: string;
    email: string;
    displayName?: string | null;
    avatarUrl?: string | null;
}

/**
 * Authentication Result Entity
 */
export interface AuthenticationResult {
    user: User;
    token?: string;
    refreshToken?: string;
}

// Domain Validation Types and Constants

/**
 * Password validation rules
 */
export const PASSWORD_RULES = {
    MIN_LENGTH: 8,
    MAX_LENGTH: 40,
    REQUIRED_PATTERN: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
    ALLOWED_SPECIAL_CHARS: '@$!%*?&'
} as const;

/**
 * Username validation rules
 */
export const USERNAME_RULES = {
    MIN_LENGTH: 3,
    MAX_LENGTH: 20,
    ALLOWED_PATTERN: /^[a-zA-Z0-9._-]+$/
} as const;

/**
 * Email validation rules
 */
export const EMAIL_RULES = {
    MAX_LENGTH: 100,
    PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
} as const;

/**
 * Display Name validation rules
 */
export const DISPLAY_NAME_RULES = {
    MAX_LENGTH: 20
} as const;

/**
 * Avatar URL validation rules
 */
export const AVATAR_URL_RULES = {
    MAX_LENGTH: 200,
    ALLOWED_PROTOCOLS: ['http:', 'https:'] as const
} as const;

/**
 * Domain Validation Error
 */
export class DomainValidationError extends Error {
    constructor(
        public field: string,
        public code: string,
        message: string
    ) {
        super(message);
        this.name = 'DomainValidationError';
    }
}

/**
 * Validation Functions - Domain Rules Implementation
 */

export function validatePassword(password: string): void {
    if (!password || password.length < PASSWORD_RULES.MIN_LENGTH || password.length > PASSWORD_RULES.MAX_LENGTH) {
        throw new DomainValidationError(
            'password',
            'INVALID_LENGTH',
            `Password must be between ${PASSWORD_RULES.MIN_LENGTH} and ${PASSWORD_RULES.MAX_LENGTH} characters`
        );
    }

    if (!PASSWORD_RULES.REQUIRED_PATTERN.test(password)) {
        throw new DomainValidationError(
            'password',
            'INVALID_COMPLEXITY',
            `Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character (${PASSWORD_RULES.ALLOWED_SPECIAL_CHARS})`
        );
    }
}

export function validateUsername(username: string): void {
    if (!username || username.length < USERNAME_RULES.MIN_LENGTH || username.length > USERNAME_RULES.MAX_LENGTH) {
        throw new DomainValidationError(
            'username',
            'INVALID_LENGTH',
            `Username must be between ${USERNAME_RULES.MIN_LENGTH} and ${USERNAME_RULES.MAX_LENGTH} characters`
        );
    }

    if (!USERNAME_RULES.ALLOWED_PATTERN.test(username)) {
        throw new DomainValidationError(
            'username',
            'INVALID_FORMAT',
            'Username can only contain letters, numbers, dots, underscores, and hyphens'
        );
    }
}

export function validateEmail(email: string): void {
    if (!email || email.length > EMAIL_RULES.MAX_LENGTH) {
        throw new DomainValidationError(
            'email',
            'INVALID_LENGTH',
            `Email must not exceed ${EMAIL_RULES.MAX_LENGTH} characters`
        );
    }

    if (!EMAIL_RULES.PATTERN.test(email)) {
        throw new DomainValidationError(
            'email',
            'INVALID_FORMAT',
            'Email must be a valid email address'
        );
    }
}

export function validateDisplayName(displayName?: string | null): void {
    if (displayName && displayName.length > DISPLAY_NAME_RULES.MAX_LENGTH) {
        throw new DomainValidationError(
            'displayName',
            'INVALID_LENGTH',
            `Display name must not exceed ${DISPLAY_NAME_RULES.MAX_LENGTH} characters`
        );
    }
}

export function validateAvatarUrl(avatarUrl?: string | null): void {
    if (!avatarUrl) return; // Empty or null is allowed

    if (avatarUrl.length > AVATAR_URL_RULES.MAX_LENGTH) {
        throw new DomainValidationError(
            'avatarUrl',
            'INVALID_LENGTH',
            `Avatar URL must not exceed ${AVATAR_URL_RULES.MAX_LENGTH} characters`
        );
    }

    try {
        const url = new URL(avatarUrl);
        if (!AVATAR_URL_RULES.ALLOWED_PROTOCOLS.includes(url.protocol as 'http:' | 'https:')) {
            throw new DomainValidationError(
                'avatarUrl',
                'INVALID_PROTOCOL',
                'Avatar URL must use HTTP or HTTPS protocol'
            );
        }
        
        // Check if domain has extension
        if (!url.hostname.includes('.')) {
            throw new DomainValidationError(
                'avatarUrl',
                'INVALID_DOMAIN',
                'Avatar URL must include a valid domain with extension'
            );
        }
    } catch (error) {
        if (error instanceof DomainValidationError) {
            throw error;
        }
        throw new DomainValidationError(
            'avatarUrl',
            'INVALID_URL',
            'Avatar URL must be a valid URL'
        );
    }
}
