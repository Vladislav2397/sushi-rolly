import type { Context } from 'hono'
import { deleteCookie, getCookie, setCookie } from 'hono/cookie'

const SESSION_COOKIE = 'sushi_session'
const SESSION_TTL_DAYS = 30

export function normalizePhone(raw: string): string {
    const digits = raw.replace(/\D/g, '')

    if (digits.length === 11 && digits.startsWith('8')) {
        return `7${digits.slice(1)}`
    }

    if (digits.length === 11 && digits.startsWith('7')) {
        return digits
    }

    if (digits.length === 10) {
        return `7${digits}`
    }

    return digits
}

export function isValidPhone(raw: string): boolean {
    return normalizePhone(raw).length === 11
}

export function createSessionToken(): string {
    const bytes = crypto.getRandomValues(new Uint8Array(32))
    return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('')
}

export function getSessionExpiry(): Date {
    const date = new Date()
    date.setDate(date.getDate() + SESSION_TTL_DAYS)
    return date
}

export function getAuthCodeExpiry(): Date {
    const date = new Date()
    date.setMinutes(date.getMinutes() + 10)
    return date
}

export function setSessionCookie(c: Context, token: string, expiresAt: Date) {
    setCookie(c, SESSION_COOKIE, token, {
        httpOnly: true,
        sameSite: 'Lax',
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        expires: expiresAt,
    })
}

export function clearSessionCookie(c: Context) {
    deleteCookie(c, SESSION_COOKIE, { path: '/' })
}

export function getSessionToken(c: Context): string | undefined {
    return getCookie(c, SESSION_COOKIE)
}

export { SESSION_COOKIE }
