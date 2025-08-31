"use server";
import { http } from "../axios";
import {
    CreateChallengeRequest,
    CreateChallengeResponse,
} from "./challenge.response";

export async function CreateChallengeAction(
    req: CreateChallengeRequest,
): Promise<CreateChallengeResponse> {
    const res = await http.post<CreateChallengeResponse>("/challenges", {
        teacherId: "7c9f57d6-1e4b-4d91-bf43-4a0e5d7f68c3",
        title: req.title,
        description: req.description,
    });

    return res.data;
}
