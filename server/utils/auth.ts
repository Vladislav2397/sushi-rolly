import type { H3Event } from 'h3'

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

export function setSessionCookie(event: H3Event, token: string, expiresAt: Date) {
    setCookie(event, SESSION_COOKIE, token, {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        expires: expiresAt,
    })
}

export function clearSessionCookie(event: H3Event) {
    deleteCookie(event, SESSION_COOKIE, { path: '/' })
}

export function getSessionToken(event: H3Event): string | undefined {
    return getCookie(event, SESSION_COOKIE)
}

export { SESSION_COOKIE }
