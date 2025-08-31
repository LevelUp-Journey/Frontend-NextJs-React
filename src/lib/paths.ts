import { Locale } from "./i18n";
import { ChallengeEditStep } from "./types";
/*
    Note: Not always locale parameter will be asked. It depends on the route.
    Based on the middleware configuration, the route loses its query params if locale is not provided.
    In case you need to remain the query params you need to pass the locale parameter.

    You can see PATHS.CHALLENGES.EDIT.STEP function as example.
    Be careful with the first '/' in the path, this indicates the root of the application.
    If it is not provided then the path will be relative to the current page.
    If it is provided then the path will be absolute.
*/
const PATHS = {
    HOME: "/",
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    CHALLENGES: {
        NEW: "/dashboard/challenges/new",
        EDIT: {
            ROOT: (challengeId: string) =>
                `/dashboard/challenges/edit/${challengeId}`,
            STEP: (
                challengeId: string,
                step: ChallengeEditStep,
                locale: Locale,
            ) => `/${locale}/dashboard/challenges/edit/${challengeId}/${step}`,
        },
    },
    TERMS: "/terms",
    PRIVACY: "/privacy",
};
export default PATHS;
