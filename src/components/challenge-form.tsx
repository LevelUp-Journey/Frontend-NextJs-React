"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { getDictionary, Locale } from "@/lib/i18n";

const createChallengeFormSchema = (dict: ReturnType<typeof getDictionary>) =>
    z.object({
        title: z
            .string()
            .min(1, dict["challenge.title.required"])
            .max(100, dict["challenge.title.maxLength"]),
        description: z
            .string()
            .min(1, dict["challenge.description.required"])
            .max(1000, dict["challenge.description.maxLength"]),
    });

export type ChallengeFormValues = {
    title: string;
    description: string;
};

interface ChallengeFormProps {
    onSubmit: (data: ChallengeFormValues) => Promise<void>;
    isLoading?: boolean;
    className?: string;
    locale: Locale;
}

export function ChallengeForm({
    onSubmit,
    isLoading = false,
    className,
    locale,
}: ChallengeFormProps) {
    const dict = getDictionary(locale);
    const challengeFormSchema = createChallengeFormSchema(dict);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<ChallengeFormValues>({
        resolver: zodResolver(challengeFormSchema),
        defaultValues: {
            title: "",
            description: "",
        },
    });

    const handleFormSubmit = (data: ChallengeFormValues) => {
        onSubmit(data);
    };

    return (
        <div className={cn("flex flex-col gap-6", className)}>
            <form onSubmit={handleSubmit(handleFormSubmit)}>
                <div className="flex flex-col gap-6">
                    <div className="grid gap-6">
                        {/* Title Field */}
                        <div className="grid gap-3">
                            <Label htmlFor="title">
                                {dict["challenge.title"]}
                            </Label>
                            <Input
                                id="title"
                                type="text"
                                placeholder={
                                    dict["challenge.title.placeholder"]
                                }
                                {...register("title")}
                                className={errors.title ? "border-red-500" : ""}
                            />
                            {errors.title && (
                                <p className="text-sm text-red-500">
                                    {errors.title.message}
                                </p>
                            )}
                        </div>

                        {/* Description Field */}
                        <div className="grid gap-3">
                            <Label htmlFor="description">
                                {dict["challenge.description"]}
                            </Label>
                            <Textarea
                                id="description"
                                placeholder={
                                    dict["challenge.description.placeholder"]
                                }
                                rows={6}
                                {...register("description")}
                                className={
                                    errors.description ? "border-red-500" : ""
                                }
                            />
                            {errors.description && (
                                <p className="text-sm text-red-500">
                                    {errors.description.message}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Submit Button */}
                    <Button
                        type="submit"
                        className="w-full"
                        disabled={isLoading || isSubmitting}
                    >
                        {isLoading || isSubmitting
                            ? dict["challenge.creating"]
                            : dict["challenge.create"]}
                    </Button>
                </div>
            </form>

            {/* Helper Text */}
            <div className="text-muted-foreground text-center text-xs text-balance">
                {dict["challenge.helpText"]}
            </div>
        </div>
    );
}
