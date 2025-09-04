"use client";
import { useState, useEffect, createContext, useContext } from "react";
import { UserController } from "@/services/iam/user.controller";
import { UserResponse } from "@/services/iam/user.response";

interface AuthContextType {
    user: UserResponse | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (token: string, refreshToken?: string, userData?: UserResponse) => void;
    logout: () => void;
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<UserResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const login = (token: string, refreshToken?: string, userData?: UserResponse) => {
        localStorage.setItem('auth_token', token);
        if (refreshToken) {
            localStorage.setItem('refresh_token', refreshToken);
        }
        if (userData) {
            setUser(userData);
        }
    };

    const logout = () => {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('refresh_token');
        setUser(null);
    };

    const refreshUser = async () => {
        try {
            const response = await UserController.getCurrentUser();
            if (response.success && response.data) {
                setUser(response.data.user);
            } else {
                logout();
            }
        } catch (error) {
            console.error('Failed to refresh user data:', error);
            logout();
        }
    };

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('auth_token');
            if (token) {
                try {
                    const response = await UserController.getCurrentUser();
                    if (response.success && response.data) {
                        setUser(response.data.user);
                    } else {
                        logout();
                    }
                } catch (error) {
                    console.error('Failed to refresh user data:', error);
                    logout();
                }
            }
            setIsLoading(false);
        };

        checkAuth();
    }, []);

    const value = {
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        refreshUser,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
