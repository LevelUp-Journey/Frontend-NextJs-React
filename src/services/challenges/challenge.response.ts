export interface ChallengeResponse {}

// Create Challenge Request
export interface CreateChallengeRequest {
    teacherId: string;
    title: string;
    description: string;
}
