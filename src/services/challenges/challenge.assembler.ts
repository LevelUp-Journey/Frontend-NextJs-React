import { Challenge, ChallengeState } from "./challenge.entity";
import { CreateChallengeResponse } from "./challenge.response";

export class ChallengeAssembler {
    public static ToEntityFromResponse(
        res: CreateChallengeResponse,
    ): Challenge {
        // TODO: Add validation logic here
        return {
            id: res.id,
            title: res.title,
            description: res.description,
            stars: res.stars,
            starsCount: res.starsCount,
            state: res.state as ChallengeState,
            teacherId: res.teacherId,
            versions: res.versions,
        };
    }
}
