"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { cn, getLocalizedPaths } from "@/lib/utils";
import PATHS from "@/lib/paths";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import GitHub from "./ui/icons/github";
import Google from "./ui/icons/google";
import { getDictionary, type Locale } from "@/lib/i18n";
import SitDownAppPet from "./ui/images/pet/sit-down";
import { DEFAULTS } from "@/lib/consts";
import { UserController } from "@/services/iam/user.controller";
import { SignInRequest } from "@/services/iam/user.request";
import { useAuth } from "@/lib/hooks/use-auth";

// Create dynamic schema based on locale
const createLoginSchema = (dict: ReturnType<typeof getDictionary>) =>
    z.object({
        email: z
            .string()
            .min(1, dict["login.email.required"])
            .email(dict["login.email.invalid"]),
        password: z
            .string()
            .min(1, dict["login.password.required"])
            .min(6, dict["login.password.minLength"])
            .max(100, dict["login.password.maxLength"]),
    });

type LoginFormData = z.infer<ReturnType<typeof createLoginSchema>>;

export function LoginForm({
    className,
    locale,
    ...props
}: React.ComponentProps<"div"> & {
    locale: Locale;
}) {
    const dict = getDictionary(locale);
    const localizedPaths = getLocalizedPaths(locale);
    const loginSchema = createLoginSchema(dict);
    const router = useRouter();
    const { login } = useAuth();

    const [step, setStep] = useState<"email" | "password">("email");

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors, isSubmitting },
        trigger,
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        mode: "onChange",
    });

    const emailValue = watch("email");

    const onEmailSubmit = async () => {
        const isEmailValid = await trigger("email");
        if (isEmailValid) {
            setStep("password");
        }
    };

    const onFormSubmit = async (data: LoginFormData) => {
        try {
            const signInRequest: SignInRequest = {
                emailOrUsername: data.email,
                password: data.password,
            };

            const response = await UserController.signIn(signInRequest);

            if (response.success && response.data) {
                // Use the auth hook to handle authentication
                login(
                    response.data.token || "",
                    response.data.refreshToken,
                    response.data.user,
                );

                toast.success(dict["login.success"]);
                router.push(localizedPaths.DASHBOARD);
            } else {
                toast.error(response.error || dict["login.error"]);
            }
        } catch (error) {
            console.error("Login error:", error);
            toast.error(dict["login.error.generic"]);
        }
    };

    const handleGoogleLogin = async () => {
        try {
            const redirectUri = `${window.location.origin}${PATHS.AUTH.CALLBACK.GOOGLE(locale)}`;
            const response =
                await UserController.initiateGoogleOAuth(redirectUri);

            console.log("response in front", response);
            if (response.success && response.data?.authUrl) {
                window.location.href = response.data.authUrl;
            } else {
                toast.error(response.error || dict["login.error.generic"]);
            }
        } catch (error) {
            console.error("Google OAuth error:", error);
            toast.error(dict["login.error.generic"]);
        }
    };

    const handleGitHubLogin = async () => {
        try {
            const response = await UserController.initiateGitHubOAuth(
                PATHS.AUTH.CALLBACK.GITHUB(locale),
            );
            if (response.success && response.data?.authUrl) {
                window.location.href = response.data.authUrl;
            } else {
                toast.error(response.error || dict["login.error.generic"]);
            }
        } catch (error) {
            console.error("GitHub OAuth error:", error);
            toast.error(dict["login.error.generic"]);
        }
    };

    const handleFormSubmit = handleSubmit((data) => {
        if (step === "email") {
            onEmailSubmit();
        } else {
            onFormSubmit(data);
        }
    });

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
                        <h1 className="text-xl font-bold">
                            {dict["login.title"]}
                        </h1>
                        <div className="text-center text-sm">
                            {dict["login.subtitle"]}
                        </div>
                    </div>
                    <div className="flex flex-col gap-6">
                        {step === "email" ? (
                            <div className="grid gap-3">
                                <Label htmlFor="email">
                                    {dict["login.email"]}
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder={
                                        dict["login.email.placeholder"]
                                    }
                                    {...register("email")}
                                    className={
                                        errors.email ? "border-red-500" : ""
                                    }
                                />
                                {errors.email && (
                                    <p className="text-sm text-red-500">
                                        {errors.email.message}
                                    </p>
                                )}
                            </div>
                        ) : (
                            <>
                                <div className="grid gap-3">
                                    <Label htmlFor="email-display">
                                        {dict["login.email"]}
                                    </Label>
                                    <div className="flex items-center gap-2">
                                        <Input
                                            id="email-display"
                                            type="email"
                                            value={emailValue}
                                            disabled
                                            className="flex-1"
                                        />
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => setStep("email")}
                                        >
                                            {dict["login.edit"]}
                                        </Button>
                                    </div>
                                </div>
                                <div className="grid gap-3">
                                    <Label htmlFor="password">
                                        {dict["login.password"]}
                                    </Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder={
                                            dict["login.password.placeholder"]
                                        }
                                        {...register("password")}
                                        className={
                                            errors.password
                                                ? "border-red-500"
                                                : ""
                                        }
                                    />
                                    {errors.password && (
                                        <p className="text-sm text-red-500">
                                            {errors.password.message}
                                        </p>
                                    )}
                                </div>
                            </>
                        )}
                        <Button
                            type="submit"
                            className="w-full"
                            disabled={isSubmitting}
                        >
                            {isSubmitting
                                ? dict["login.loading"]
                                : step === "email"
                                  ? dict["login.continue"]
                                  : dict["login.signin"]}
                        </Button>
                    </div>
                    <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                        <span className="bg-background text-muted-foreground relative z-10 px-2">
                            {dict["login.or"]}
                        </span>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                        <Button
                            variant="outline"
                            type="button"
                            className="w-full"
                            onClick={handleGitHubLogin}
                            disabled={isSubmitting}
                        >
                            <GitHub />
                            {dict["login.continueWith"]} {dict["login.github"]}
                        </Button>
                        <Button
                            variant="outline"
                            type="button"
                            className="w-full"
                            onClick={handleGoogleLogin}
                            disabled={isSubmitting}
                        >
                            <Google />
                            {dict["login.continueWith"]} {dict["login.google"]}
                        </Button>
                    </div>
                </div>
            </form>
            <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
                {dict["login.agreement"]}{" "}
                <Link href={localizedPaths.TERMS}>{dict["login.terms"]}</Link>{" "}
                and{" "}
                <Link href={localizedPaths.PRIVACY}>
                    {dict["login.privacy"]}
                </Link>
                .
            </div>
        </div>
    );
}
