"use client";

import { ChallengeEditStep } from "@/lib/types";
import { useParams, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function EditChallengePage() {
    const params = useParams();
    const searchParams = useSearchParams();
    const editStep = searchParams.get("step") || ChallengeEditStep.ADD_VERSION;
    const challengeId = params.challengeId;

    const [step, setStep] = useState(Number.parseInt(editStep.toString()));

    return (
        <div>
            <h1>Edit Challenge</h1>
            <p>Challenge ID: {challengeId}</p>
            <p>Edit Step: {editStep}</p>
            <p>Current Step: {step}</p>
        </div>
    );
}
