/**
 * @file auth-utils.ts
 * @description Utility functions for browser-side cookie management.
 * Provides helper functions to set, get, and delete the 'auth-token' cookie.
 */

export function setCookie(name: string, value: string, days = 7) {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
}

export function getCookie(name: string) {
    return document.cookie.split('; ').reduce((r, v) => {
        const parts = v.split('=');
        return parts[0] === name ? decodeURIComponent(parts[1]) : r;
    }, '');
}

export function deleteCookie(name: string) {
    setCookie(name, '', -1);
}
