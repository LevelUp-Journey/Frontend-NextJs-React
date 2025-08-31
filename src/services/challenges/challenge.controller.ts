import { CreateChallengeAction } from "./challenge.actions";
import { ChallengeAssembler } from "./challenge.assembler";
import { Challenge } from "./challenge.entity";
import { CreateChallengeRequest } from "./challenge.response";

export class ChallengeController {
    public static async CreateChallenge(
        request: CreateChallengeRequest,
    ): Promise<Challenge> {
        const res = await CreateChallengeAction(request);

        const challenge = ChallengeAssembler.ToEntityFromResponse(res);

        return challenge;
    }
}
