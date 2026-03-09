/**
 * @file api-server.ts
 * @description Helper for server-side API calls within Next.js Server Components.
 * Manages manual cookie extraction and passes the 'auth-token' to the Axios instance
 * for authenticated requests on the server.
 */

import axios from "axios";
import { cookies } from "next/headers";

const BASE_URL = process.env.NEXT_PUBLIC_SPRING_BOOT_API_URL || "http://localhost:8080/api";

export async function serverApiFetch<T>(endpoint: string, options: any = {}): Promise<T> {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth-token")?.value;

    const response = await axios({
        url: `${BASE_URL}${endpoint}`,
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...options.headers,
        },
    });

    return response.data;
}

export const serverApi = {
    get: <T>(endpoint: string, options?: any) =>
        serverApiFetch<T>(endpoint, { ...options, method: "GET" }),

    post: <T>(endpoint: string, data?: any, options?: any) =>
        serverApiFetch<T>(endpoint, { ...options, method: "POST", data, ...options }),
};
