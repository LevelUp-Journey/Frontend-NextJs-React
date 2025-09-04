"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { cn, getLocalizedPaths } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import GitHub from "./ui/icons/github";
import Google from "./ui/icons/google";
import { getDictionary, type Locale } from "@/lib/i18n";
import { DEFAULTS } from "@/lib/consts";
import SitDownAppPet from "./ui/images/pet/sit-down";
import { UserController } from "@/services/iam/user.controller";
import { SignUpRequest } from "@/services/iam/user.request";
import { useAuth } from "@/lib/hooks/use-auth";
import env from "@/lib/env";

// Create dynamic schema based on locale
const createRegisterSchema = (dict: ReturnType<typeof getDictionary>) =>
    z
        .object({
            email: z
                .string()
                .min(1, dict["register.email.required"])
                .email(dict["register.email.invalid"]),
            username: z
                .string()
                .min(1, dict["register.username.required"])
                .min(3, dict["register.username.minLength"])
                .max(20, dict["register.username.maxLength"])
                .regex(/^[a-zA-Z0-9_]+$/, dict["register.username.pattern"]),
            password: z
                .string()
                .min(1, dict["register.password.required"])
                .min(8, dict["register.password.minLength"])
                .max(100, dict["register.password.maxLength"])
                .regex(
                    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                    dict["register.password.pattern"],
                ),
            confirmPassword: z
                .string()
                .min(1, dict["register.confirmPassword.required"]),
        })
        .refine((data) => data.password === data.confirmPassword, {
            message: dict["register.confirmPassword.mismatch"],
            path: ["confirmPassword"],
        });

type RegisterFormData = {
    email: string;
    username: string;
    password: string;
    confirmPassword: string;
};

type Step =
    | "providers"
    | "email"
    | "username"
    | "password"
    | "confirmPassword"
    | "summary";

export function RegisterForm({
    className,
    locale,
    ...props
}: React.ComponentProps<"div"> & {
    locale: Locale;
}) {
    const dict = getDictionary(locale);
    const localizedPaths = getLocalizedPaths(locale);
    const registerSchema = createRegisterSchema(dict);
    const router = useRouter();
    const { login } = useAuth();

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
        try {
            const signUpRequest: SignUpRequest = {
                email: data.email,
                username: data.username,
                password: data.password
            };

            const response = await UserController.signUp(signUpRequest);
            
            if (response.success && response.data) {
                // Use the auth hook to handle authentication
                login(
                    response.data.token || '',
                    response.data.refreshToken,
                    response.data.user
                );

                toast.success(dict["register.success"]);
                router.push(localizedPaths.DASHBOARD);
            } else {
                toast.error(response.error || dict["register.error"]);
            }
        } catch (error) {
            console.error('Registration error:', error);
            toast.error(dict["register.error.generic"]);
        }
    };

    const handleGoogleRegister = async () => {
        try {
            window.location.href = `${env.API_BASE_URL}/oauth2/authorization/google`;
        } catch (error) {
            console.error('Google OAuth error:', error);
            toast.error(dict["register.error.generic"]);
        }
    };

    const handleGitHubRegister = async () => {
        try {
            window.location.href = `${env.API_BASE_URL}/oauth2/authorization/github`;
        } catch (error) {
            console.error('GitHub OAuth error:', error);
            toast.error(dict["register.error.generic"]);
        }
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
                                onClick={handleGitHubRegister}
                                disabled={isSubmitting}
                            >
                                <GitHub />
                                {dict["register.continueWith"]}{" "}
                                {dict["register.github"]}
                            </Button>
                            <Button
                                variant="outline"
                                type="button"
                                className="w-full"
                                onClick={handleGoogleRegister}
                                disabled={isSubmitting}
                            >
                                <Google />
                                {dict["register.continueWith"]}{" "}
                                {dict["register.google"]}
                            </Button>
                        </div>
                        <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                            <span className="bg-background text-muted-foreground relative z-10 px-2">
                                {dict["register.or"]}
                            </span>
                        </div>
                        <Button
                            type="button"
                            className="w-full"
                            onClick={handleContinueWithEmail}
                        >
                            {dict["register.continueWith"]} Email
                        </Button>
                    </>
                );

            case "email":
                return (
                    <div className="grid gap-3">
                        <Label htmlFor="email">{dict["register.email"]}</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder={dict["register.email.placeholder"]}
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
                        <Label htmlFor="username">
                            {dict["register.username"]}
                        </Label>
                        <Input
                            id="username"
                            type="text"
                            placeholder={dict["register.username.placeholder"]}
                            {...register("username")}
                            className={errors.username ? "border-red-500" : ""}
                        />
                        {errors.username && (
                            <p className="text-sm text-red-500">
                                {errors.username.message}
                            </p>
                        )}
                        <p className="text-xs text-muted-foreground">
                            {dict["register.username.pattern"]}
                        </p>
                    </div>
                );

            case "password":
                return (
                    <div className="grid gap-3">
                        <Label htmlFor="password">
                            {dict["register.password"]}
                        </Label>
                        <Input
                            id="password"
                            type="password"
                            placeholder={dict["register.password.placeholder"]}
                            {...register("password")}
                            className={errors.password ? "border-red-500" : ""}
                        />
                        {errors.password && (
                            <p className="text-sm text-red-500">
                                {errors.password.message}
                            </p>
                        )}
                        <p className="text-xs text-muted-foreground">
                            {dict["register.password.pattern"]}
                        </p>
                    </div>
                );

            case "confirmPassword":
                return (
                    <div className="grid gap-3">
                        <Label htmlFor="confirmPassword">
                            {dict["register.confirmPassword"]}
                        </Label>
                        <Input
                            id="confirmPassword"
                            type="password"
                            placeholder={
                                dict["register.confirmPassword.placeholder"]
                            }
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
                                {dict["register.summary.title"]}
                            </h3>
                        </div>
                        <div className="space-y-3 p-4 border rounded-lg bg-muted/50">
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-medium">
                                    {dict["register.email"]}:
                                </span>
                                <span className="text-sm">
                                    {watchedValues.email}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-medium">
                                    {dict["register.username"]}:
                                </span>
                                <span className="text-sm">
                                    @{watchedValues.username}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-medium">
                                    {dict["register.password"]}:
                                </span>
                                <span className="text-sm">••••••••</span>
                            </div>
                        </div>
                        <p className="text-xs text-muted-foreground text-center">
                            {dict["register.summary.subtitle"]}
                        </p>
                    </div>
                );
        }
    };

    const getStepTitle = () => {
        switch (step) {
            case "providers":
                return dict["register.title"];
            case "email":
                return dict["register.email"];
            case "username":
                return dict["register.username"];
            case "password":
                return dict["register.password"];
            case "confirmPassword":
                return dict["register.confirmPassword"];
            case "summary":
                return dict["register.title"];
            default:
                return dict["register.title"];
        }
    };

    const getButtonText = () => {
        switch (step) {
            case "summary":
                return dict["register.summary.create"];
            default:
                return dict["login.continue"];
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
                            href={localizedPaths.HOME}
                            className="flex flex-col items-center gap-2 font-medium"
                        >
                            <div className="flex items-center justify-center rounded-md">
                                <SitDownAppPet
                                    width={72}
                                    height={72}
                                    alt={dict["pet.alt.sitdown"]}
                                />
                            </div>
                            <span className="sr-only">{DEFAULTS.APP_NAME}</span>
                        </Link>
                        <h1 className="text-xl font-bold">{getStepTitle()}</h1>
                        <div className="text-center text-sm">
                            {dict["register.haveAccount"]}{" "}
                            <Link
                                href={localizedPaths.LOGIN}
                                className="underline underline-offset-4"
                            >
                                {dict["register.signin"]}
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
                                        {dict["register.back"]}
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
                                        ? dict["register.summary.creating"]
                                        : getButtonText()}
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </form>

            <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
                {dict["register.agreement"]}{" "}
                <Link href={localizedPaths.TERMS}>
                    {dict["register.terms"]}
                </Link>{" "}
                {dict["register.terms"] === "Terms of Service" ? "and" : "y"}{" "}
                <Link href={localizedPaths.PRIVACY}>
                    {dict["register.privacy"]}
                </Link>
                .
            </div>
        </div>
    );
}
