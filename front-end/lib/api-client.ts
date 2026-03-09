/**
 * @file api-client.ts
 * @description Centralized Axios instance for client-side API calls.
 * Includes request interceptors to automatically attach the JWT 'auth-token' cookie
 * to outbound requests and response interceptors for standardized error handling.
 */

import axios, { AxiosInstance, InternalAxiosRequestConfig } from "axios";
import { getCookie } from "./auth-utils";

const BASE_URL = process.env.NEXT_PUBLIC_SPRING_BOOT_API_URL || "http://localhost:8080/api";

const axiosInstance: AxiosInstance = axios.create({
    baseURL: BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Request interceptor to add auth token
axiosInstance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = typeof window !== "undefined" ? getCookie("auth-token") : null;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for data extraction and error handling
axiosInstance.interceptors.response.use(
    (response) => {
        return response.data;
    },
    (error) => {
        const message = error.response?.data?.message || error.message || "An unexpected error occurred";
        return Promise.reject(new Error(message));
    }
);

export const api = {
    get: <T>(endpoint: string, options?: any) =>
        axiosInstance.get<any, T>(endpoint, options),

    post: <T>(endpoint: string, data?: any, options?: any) =>
        axiosInstance.post<any, T>(endpoint, data, options),

    put: <T>(endpoint: string, data?: any, options?: any) =>
        axiosInstance.put<any, T>(endpoint, data, options),

    delete: <T>(endpoint: string, options?: any) =>
        axiosInstance.delete<any, T>(endpoint, options),
};

export default axiosInstance;
