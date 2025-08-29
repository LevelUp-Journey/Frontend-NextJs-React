"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { GalleryVerticalEnd } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import GitHub from "./ui/icons/github";
import Google from "./ui/icons/google";
import DEFAULTS, { PATHS } from "@/lib/consts";

// Zod schema para validación del registro
const registerSchema = z
    .object({
        email: z
            .string()
            .min(1, "Email is required")
            .email("Please enter a valid email address"),
        username: z
            .string()
            .min(1, "Username is required")
            .min(3, "Username must be at least 3 characters long")
            .max(20, "Username must be less than 20 characters")
            .regex(
                /^[a-zA-Z0-9_]+$/,
                "Username can only contain letters, numbers, and underscores",
            ),
        password: z
            .string()
            .min(1, "Password is required")
            .min(8, "Password must be at least 8 characters long")
            .max(100, "Password must be less than 100 characters")
            .regex(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                "Password must contain at least one uppercase letter, one lowercase letter, and one number",
            ),
        confirmPassword: z.string().min(1, "Please confirm your password"),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords don't match",
        path: ["confirmPassword"],
    });

type RegisterFormData = z.infer<typeof registerSchema>;

type Step =
    | "providers"
    | "email"
    | "username"
    | "password"
    | "confirmPassword"
    | "summary";

export function RegisterForm({
    className,
    ...props
}: React.ComponentProps<"div">) {
    const [step, setStep] = useState<Step>("providers");

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors, isSubmitting },
        trigger,
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
        mode: "onChange",
    });

    const watchedValues = watch();

    const handleContinueWithEmail = () => {
        setStep("email");
    };

    const handleNextStep = async () => {
        let isValid = false;

        switch (step) {
            case "email":
                isValid = await trigger("email");
                if (isValid) setStep("username");
                break;
            case "username":
                isValid = await trigger("username");
                if (isValid) setStep("password");
                break;
            case "password":
                isValid = await trigger("password");
                if (isValid) setStep("confirmPassword");
                break;
            case "confirmPassword":
                isValid = await trigger("confirmPassword");
                if (isValid) setStep("summary");
                break;
        }
    };

    const handleBackStep = () => {
        switch (step) {
            case "email":
                setStep("providers");
                break;
            case "username":
                setStep("email");
                break;
            case "password":
                setStep("username");
                break;
            case "confirmPassword":
                setStep("password");
                break;
            case "summary":
                setStep("confirmPassword");
                break;
        }
    };

    const onFormSubmit = async (data: RegisterFormData) => {
        console.log("Registration data:", data);
        // Aquí iría la lógica de registro
    };

    const handleFormSubmit = handleSubmit((data) => {
        if (step === "summary") {
            onFormSubmit(data);
        } else {
            handleNextStep();
        }
    });

    const renderStepContent = () => {
        switch (step) {
            case "providers":
                return (
                    <>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <Button
                                variant="outline"
                                type="button"
                                className="w-full"
                            >
                                <GitHub />
                                Continue with Github
                            </Button>
                            <Button
                                variant="outline"
                                type="button"
                                className="w-full"
                            >
                                <Google />
                                Continue with Google
                            </Button>
                        </div>
                        <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                            <span className="bg-background text-muted-foreground relative z-10 px-2">
                                Or
                            </span>
                        </div>
                        <Button
                            type="button"
                            className="w-full"
                            onClick={handleContinueWithEmail}
                        >
                            Continue with Email
                        </Button>
                    </>
                );

            case "email":
                return (
                    <div className="grid gap-3">
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="Enter your email address"
                            {...register("email")}
                            className={errors.email ? "border-red-500" : ""}
                        />
                        {errors.email && (
                            <p className="text-sm text-red-500">
                                {errors.email.message}
                            </p>
                        )}
                    </div>
                );

            case "username":
                return (
                    <div className="grid gap-3">
                        <Label htmlFor="username">Username</Label>
                        <Input
                            id="username"
                            type="text"
                            placeholder="Choose a username"
                            {...register("username")}
                            className={errors.username ? "border-red-500" : ""}
                        />
                        {errors.username && (
                            <p className="text-sm text-red-500">
                                {errors.username.message}
                            </p>
                        )}
                        <p className="text-xs text-muted-foreground">
                            Username can only contain letters, numbers, and
                            underscores
                        </p>
                    </div>
                );

            case "password":
                return (
                    <div className="grid gap-3">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            placeholder="Create a strong password"
                            {...register("password")}
                            className={errors.password ? "border-red-500" : ""}
                        />
                        {errors.password && (
                            <p className="text-sm text-red-500">
                                {errors.password.message}
                            </p>
                        )}
                        <p className="text-xs text-muted-foreground">
                            Password must contain at least 8 characters with
                            uppercase, lowercase, and numbers
                        </p>
                    </div>
                );

            case "confirmPassword":
                return (
                    <div className="grid gap-3">
                        <Label htmlFor="confirmPassword">
                            Confirm Password
                        </Label>
                        <Input
                            id="confirmPassword"
                            type="password"
                            placeholder="Confirm your password"
                            {...register("confirmPassword")}
                            className={
                                errors.confirmPassword ? "border-red-500" : ""
                            }
                        />
                        {errors.confirmPassword && (
                            <p className="text-sm text-red-500">
                                {errors.confirmPassword.message}
                            </p>
                        )}
                    </div>
                );

            case "summary":
                return (
                    <div className="grid gap-4">
                        <div className="text-center">
                            <h3 className="text-lg font-semibold mb-4">
                                Review Your Information
                            </h3>
                        </div>
                        <div className="space-y-3 p-4 border rounded-lg bg-muted/50">
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-medium">
                                    Email:
                                </span>
                                <span className="text-sm">
                                    {watchedValues.email}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-medium">
                                    Username:
                                </span>
                                <span className="text-sm">
                                    @{watchedValues.username}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-medium">
                                    Password:
                                </span>
                                <span className="text-sm">••••••••</span>
                            </div>
                        </div>
                        <p className="text-xs text-muted-foreground text-center">
                            Please review your information before creating your
                            account
                        </p>
                    </div>
                );
        }
    };

    const getStepTitle = () => {
        switch (step) {
            case "providers":
                return `Join ${DEFAULTS.APP_NAME}`;
            case "email":
                return "What's your email?";
            case "username":
                return "Choose your username";
            case "password":
                return "Create a password";
            case "confirmPassword":
                return "Confirm your password";
            case "summary":
                return "Almost done!";
            default:
                return `Join ${DEFAULTS.APP_NAME}`;
        }
    };

    const getButtonText = () => {
        switch (step) {
            case "summary":
                return "Create Account";
            default:
                return "Continue";
        }
    };

    const showBackButton = step !== "providers";
    const showMainButton = step !== "providers";

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <form onSubmit={handleFormSubmit}>
                <div className="flex flex-col gap-6">
                    <div className="flex flex-col items-center gap-2">
                        <Link
                            href={PATHS.HOME}
                            className="flex flex-col items-center gap-2 font-medium"
                        >
                            <div className="flex size-8 items-center justify-center rounded-md">
                                <GalleryVerticalEnd className="size-6" />
                            </div>
                            <span className="sr-only">Acme Inc.</span>
                        </Link>
                        <h1 className="text-xl font-bold">{getStepTitle()}</h1>
                        <div className="text-center text-sm">
                            Already have an account?{" "}
                            <Link
                                href={PATHS.LOGIN}
                                className="underline underline-offset-4"
                            >
                                Sign in
                            </Link>
                        </div>
                    </div>

                    <div className="flex flex-col gap-6">
                        {renderStepContent()}

                        {showMainButton && (
                            <div className="flex gap-2">
                                {showBackButton && (
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={handleBackStep}
                                        className="flex-1"
                                    >
                                        Back
                                    </Button>
                                )}
                                <Button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className={
                                        showBackButton ? "flex-1" : "w-full"
                                    }
                                >
                                    {isSubmitting
                                        ? "Loading..."
                                        : getButtonText()}
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </form>

            <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
                By creating an account, you agree to our{" "}
                <Link href={PATHS.TERMS}>Terms of Service</Link> and{" "}
                <Link href={PATHS.PRIVACY}>Privacy Policy</Link>.
            </div>
        </div>
    );
}
