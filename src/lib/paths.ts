import { ChallengeEditStep } from "./types";

const PATHS = {
    HOME: "/",
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    CHALLENGES: {
        NEW: "/dashboard/challenges/new",
        EDIT: {
            ROOT: (challengeId: string) =>
                `/dashboard/challenges/edit/${challengeId}`,
            STEP: (challengeId: string, stepId: ChallengeEditStep) =>
                `/dashboard/challenges/edit/${challengeId}/step/${stepId}`,
        },
    },
    TERMS: "/terms",
    PRIVACY: "/privacy",
};
export default PATHS;
