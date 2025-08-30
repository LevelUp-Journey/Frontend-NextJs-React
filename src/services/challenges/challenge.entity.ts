/**
 * Challenge Bounded Context - Domain Model Interfaces in TypeScript
 */

// ========== ENUMS ==========

export enum Language {
    CPP,
    JAVASCRIPT,
    PYTHON,
}

export enum ChallengeState {
    DRAFT,
    PUBLISHED,
    ARCHIVED,
    DELETED,
}

// ========== CORE DOMAIN INTERFACES ==========

export interface Challenge {
    id: string;
    teacherId: string;
    title: string;
    description: string;
    state: ChallengeState;
    stars: ChallengeStar[];
    versions: ChallengeVersion[];
    starsCount: number;
}

export interface ChallengeStar {
    userId: string;
    challengeId: string;
}

export interface ChallengeVersion {
    id: number;
    challengeId: string;
    language: Language;
    defaultStudentCode: string;
    tests: Test[];
}

export interface Test {
    id: string;
    title: string;
    hint: string;
    onErrorHint: string;
    // testCode: string; This cannot be requested due to security reasons.
    input: string;
    expectedOutput: string;
    challengeVersionId: number;
}

// ========== RESPONSES/DTOs ==========

export interface ChallengeResponse {
    id: string;
    teacherId: string;
    title: string;
    description: string;
    state: ChallengeState;
    starsCount: number;
    versionsCount: number;
    versions: ChallengeVersionResponse[];
}

export interface ChallengeVersionResponse {
    id: number;
    language: Language;
    defaultStudentCode: string;
    testsCount: number;
    tests: TestResponse[];
}

export interface TestResponse {
    id: string;
    title: string;
    hint: string;
    onErrorHint: string;
    input: string;
    expectedOutput: string;
}

export interface ChallengeStarResponse {
    userId: string;
    challengeId: string;
}
