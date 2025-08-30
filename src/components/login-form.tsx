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

// Zod schema for validation
const loginSchema = z.object({
    email: z
        .string()
        .min(1, "Email is required")
        .email("Please enter a valid email address"),
    password: z
        .string()
        .min(1, "Password is required")
        .min(6, "Password must be at least 6 characters long")
        .max(100, "Password must be less than 100 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginForm({
    className,
    ...props
}: React.ComponentProps<"div">) {
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

    const onFormSubmit = (data: LoginFormData) => {
        console.log("Login data:", data);
        // TODO: Implement login logic
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
                            href={PATHS.HOME}
                            className="flex flex-col items-center gap-2 font-medium"
                        >
                            <div className="flex size-8 items-center justify-center rounded-md">
                                <GalleryVerticalEnd className="size-6" />
                            </div>
                            <span className="sr-only">Acme Inc.</span>
                        </Link>
                        <h1 className="text-xl font-bold">
                            Welcome to {DEFAULTS.APP_NAME}
                        </h1>
                        <div className="text-center text-sm">
                            Don&apos;t have an account?{" "}
                            <Link
                                href={PATHS.REGISTER}
                                className="underline underline-offset-4"
                            >
                                Sign up
                            </Link>
                        </div>
                    </div>
                    <div className="flex flex-col gap-6">
                        {step === "email" ? (
                            <div className="grid gap-3">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="m@example.com"
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
                                    <Label htmlFor="email-display">Email</Label>
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
                                            Edit
                                        </Button>
                                    </div>
                                </div>
                                <div className="grid gap-3">
                                    <Label htmlFor="password">Password</Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder="Enter your password"
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
                                ? "Loading..."
                                : step === "email"
                                  ? "Continue"
                                  : "Login"}
                        </Button>
                    </div>
                    <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                        <span className="bg-background text-muted-foreground relative z-10 px-2">
                            Or
                        </span>
                    </div>
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
                </div>
            </form>
            <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
                By clicking continue, you agree to our{" "}
                <Link href={PATHS.TERMS}>Terms of Service</Link> and{" "}
                <Link href={PATHS.PRIVACY}>Privacy Policy</Link>.
            </div>
        </div>
    );
}
