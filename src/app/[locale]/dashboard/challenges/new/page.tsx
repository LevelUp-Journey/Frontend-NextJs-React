"use client";

import { useState } from "react";
import {
    ChallengeForm,
    ChallengeFormValues,
} from "@/components/challenge-form";
import { useParams, useRouter } from "next/navigation";
import { ChallengeController } from "@/services/challenges/challenge.controller";
import { getDictionary, Locale } from "@/lib/i18n";
import { toast } from "sonner";
import PATHS from "@/lib/paths";
import { ChallengeEditStep } from "@/lib/types";

export default function NewChallengePage() {
    const params = useParams();
    const locale = params.locale as Locale;
    const dict = getDictionary(locale);
    const router = useRouter();

    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (data: ChallengeFormValues) => {
        setIsLoading(true);

        try {
            // Here you'll implement the logic to create the challenge
            // For example, call the API
            console.log("Challenge data:", data);

            const res = await ChallengeController.CreateChallenge({
                description: data.description,
                title: data.title,
                // TODO: Remove this line when you implement the logic
                teacherId: "ACTION_ALREADY_SET_TEACHER_ID",
            });
            console.log("Challenge created:", res);

            // Here you could redirect the user or show a success message
            toast.success(dict["newChallenge.success"]);
            // router.push(
            //     PATHS.CHALLENGES.EDIT.STEP(
            //         res.id,
            //         ChallengeEditStep.ADD_VERSION,
            //     ),
            // );
        } catch (error) {
            console.error("Error creating challenge:", error);
            toast.error(dict["newChallenge.error"]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
            <div className="w-full max-w-lg">
                <div className="flex flex-col gap-6">
                    {/* Header Section */}
                    <div className="flex flex-col items-center gap-3 text-center">
                        <h1 className="text-2xl font-semibold tracking-tight">
                            {dict["newChallenge.title"]}
                        </h1>
                        <p className="text-muted-foreground text-sm text-balance">
                            {dict["newChallenge.description"]}
                        </p>
                    </div>

                    {/* Form Section */}
                    <ChallengeForm
                        onSubmit={handleSubmit}
                        isLoading={isLoading}
                        locale={locale}
                    />
                </div>
            </div>
        </div>
    );
}
