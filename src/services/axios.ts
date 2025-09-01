import env from "@/lib/env";
import axios from "axios";

export const http = axios.create({
    baseURL: env.API_BASE_URL,
});

// Request interceptor to add auth token
http.interceptors.request.use(
    (config) => {
        // Only add token on client side
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('auth_token');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle token expiration and refresh
http.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Handle 401 unauthorized responses
        if (error.response?.status === 401 && !originalRequest._retry && typeof window !== 'undefined') {
            originalRequest._retry = true;

            // Try to refresh the token first
            const refreshToken = localStorage.getItem('refresh_token');
            
            if (refreshToken) {
                try {
                    // Attempt to refresh the token
                    const response = await axios.post(`${env.API_BASE_URL}/api/v1/authentication/refresh`, {
                        refreshToken: refreshToken
                    });
                    
                    if (response.data?.token) {
                        localStorage.setItem('auth_token', response.data.token);
                        if (response.data.refreshToken) {
                            localStorage.setItem('refresh_token', response.data.refreshToken);
                        }
                        
                        // Retry the original request with the new token
                        originalRequest.headers.Authorization = `Bearer ${response.data.token}`;
                        return http(originalRequest);
                    }
                } catch (refreshError) {
                    console.error('Token refresh failed:', refreshError);
                }
            }

            // If token refresh failed or no refresh token, logout user
            localStorage.removeItem('auth_token');
            localStorage.removeItem('refresh_token');
            
            // Redirect to login page
            const currentPath = window.location.pathname;
            const locale = currentPath.split('/')[1];
            window.location.href = `/${locale}/auth/login`;
        }
        
        return Promise.reject(error);
    }
);
