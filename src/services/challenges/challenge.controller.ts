import { CreateChallengeAction } from "./challenge.actions";
import { CreateChallengeRequest } from "./challenge.response";

export class ChallengeController {
    public static async CreateChallenge(request: CreateChallengeRequest) {
        const res = await CreateChallengeAction(request);
        return res;
    }
}
