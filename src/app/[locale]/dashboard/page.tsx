"use client";
import { useAuth } from "@/lib/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function DashboardPage() {
    const { user } = useAuth();

    return (
        <div className="flex flex-col gap-6">
            {user && (
                <Card>
                    <CardHeader>
                        <CardTitle>Welcome back, {user.displayName || user.username}!</CardTitle>
                        <CardDescription>
                            You are logged in as {user.email}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-2">
                            <p><strong>Username:</strong> {user.username}</p>
                            <p><strong>Email:</strong> {user.email}</p>
                            <p><strong>Login Provider:</strong> {user.loginProvider}</p>
                            <p><strong>Member since:</strong> {new Date(user.createdAt).toLocaleDateString()}</p>
                        </div>
                    </CardContent>
                </Card>
            )}
            
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                    <CardHeader>
                        <CardTitle>Challenges</CardTitle>
                        <CardDescription>
                            Create and manage coding challenges
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button className="w-full">
                            View Challenges
                        </Button>
                    </CardContent>
                </Card>
                
                <Card>
                    <CardHeader>
                        <CardTitle>Profile</CardTitle>
                        <CardDescription>
                            Manage your profile settings
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button variant="outline" className="w-full">
                            Edit Profile
                        </Button>
                    </CardContent>
                </Card>
                
                <Card>
                    <CardHeader>
                        <CardTitle>Statistics</CardTitle>
                        <CardDescription>
                            View your progress and stats
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button variant="outline" className="w-full">
                            View Stats
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
