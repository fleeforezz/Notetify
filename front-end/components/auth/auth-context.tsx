/**
 * @file auth-context.tsx
 * @description React Context and provider for managing authentication state globally.
 * Handles login, registration, logout, and session persistence logic using the API client.
 */

"use client"

import React, { createContext, useContext, useEffect, useState } from "react"
import { api } from "@/lib/api-client"
import { setCookie, getCookie, deleteCookie } from "@/lib/auth-utils"
import { useRouter } from "next/navigation"

interface User {
    id: string
    email: string
    name?: string
}

interface AuthContextType {
    user: User | null
    loading: boolean
    login: (email: string, password: string) => Promise<void>
    signUp: (email: string, password: string) => Promise<void>
    logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
        async function checkAuth() {
            const token = getCookie("auth-token")
            if (token) {
                try {
                    // Assuming an endpoint to get current user details
                    const userData = await api.get<User>("/auth/me", {
                        headers: { Authorization: `Bearer ${token}` },
                    })
                    setUser(userData)
                } catch (error) {
                    console.error("Failed to fetch user", error)
                    deleteCookie("auth-token")
                    setUser(null)
                }
            }
            setLoading(false)
        }
        checkAuth()
    }, [])

    const login = async (email: string, password: string) => {
        const { token, user: userData } = await api.post<{ token: string; user: User }>("/auth/login", {
            email,
            password,
        })
        setCookie("auth-token", token)
        setUser(userData)
        router.push("/notes")
        router.refresh()
    }

    const signUp = async (email: string, password: string) => {
        await api.post("/auth/register", { email, password })
        // Potentially auto-login or redirect to login
    }

    const logout = () => {
        deleteCookie("auth-token")
        setUser(null)
        router.push("/auth/login")
        router.refresh()
    }

    return (
        <AuthContext.Provider value={{ user, loading, login, signUp, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider")
    }
    return context
}
