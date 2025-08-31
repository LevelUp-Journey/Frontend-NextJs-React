// Create Challenge Request
export interface CreateChallengeRequest {
    teacherId: string;
    title: string;
    description: string;
}

export interface CreateChallengeResponse {
    id: string;
    teacherId: string;
    title: string;
    description: string;
    state: string;
    stars: any[];
    versions: any[];
    starsCount: number;
}
