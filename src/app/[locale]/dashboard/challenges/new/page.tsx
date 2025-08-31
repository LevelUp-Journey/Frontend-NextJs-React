"use client";

import { useState } from "react";
import {
    ChallengeForm,
    ChallengeFormValues,
} from "@/components/challenge-form";
import { useParams } from "next/navigation";
import { getDictionary, Locale } from "@/lib/i18n";

export default function NewChallengePage() {
    const params = useParams();
    const locale = params.locale as Locale;
    const dict = getDictionary(locale);

    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (data: ChallengeFormValues) => {
        setIsLoading(true);

        try {
            // Here you'll implement the logic to create the challenge
            // For example, call the API
            console.log("Challenge data:", data);

            // Simulate API delay
            await new Promise((resolve) => setTimeout(resolve, 2000));

            // Here you could redirect the user or show a success message
            alert(dict["newChallenge.success"]);
        } catch (error) {
            console.error("Error creating challenge:", error);
            alert(dict["newChallenge.error"]);
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
