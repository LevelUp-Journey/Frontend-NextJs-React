"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const challengeFormSchema = z.object({
    title: z
        .string()
        .min(1, "Title is required")
        .max(100, "Title cannot exceed 100 characters"),
    description: z
        .string()
        .min(1, "Description is required")
        .max(1000, "Description cannot exceed 1000 characters"),
});

export type ChallengeFormValues = z.infer<typeof challengeFormSchema>;

interface ChallengeFormProps {
    onSubmit: (data: ChallengeFormValues) => Promise<void>;
    isLoading?: boolean;
    className?: string;
}

export function ChallengeForm({
    onSubmit,
    isLoading = false,
    className,
}: ChallengeFormProps) {
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
                            <Label htmlFor="title">Challenge title</Label>
                            <Input
                                id="title"
                                type="text"
                                placeholder="Enter the challenge title"
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
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                placeholder="Describe the challenge in detail. Include learning objectives and specific instructions..."
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
                            ? "Creating challenge..."
                            : "Create challenge"}
                    </Button>
                </div>
            </form>

            {/* Helper Text */}
            <div className="text-muted-foreground text-center text-xs text-balance">
                Once created, you can add tests and configure supported
                programming languages.
            </div>
        </div>
    );
}
