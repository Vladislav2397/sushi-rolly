import type { Context } from 'hono'
import { deleteCookie, getCookie, setCookie } from 'hono/cookie'
import { HTTPException } from 'hono/http-exception'
import { and, eq, gt } from 'drizzle-orm'
import { useDb, schema } from '../database/client'

const ADMIN_SESSION_COOKIE = 'admin_session'
const SESSION_TTL_DAYS = 14

export function createAdminSessionToken(): string {
    const bytes = crypto.getRandomValues(new Uint8Array(32))
    return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('')
}

export function getAdminSessionExpiry(): Date {
    const date = new Date()
    date.setDate(date.getDate() + SESSION_TTL_DAYS)
    return date
}

export function setAdminSessionCookie(c: Context, token: string, expiresAt: Date) {
    setCookie(c, ADMIN_SESSION_COOKIE, token, {
        httpOnly: true,
        sameSite: 'Lax',
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        expires: expiresAt,
    })
}

export function clearAdminSessionCookie(c: Context) {
    deleteCookie(c, ADMIN_SESSION_COOKIE, { path: '/' })
}

export function getAdminSessionToken(c: Context): string | undefined {
    return getCookie(c, ADMIN_SESSION_COOKIE)
}

export function mapAdmin(admin: typeof schema.admins.$inferSelect) {
    return {
        id: admin.id,
        email: admin.email,
        createdAt: admin.createdAt.toISOString(),
    }
}

export async function getCurrentAdmin(c: Context) {
    const token = getAdminSessionToken(c)
    if (!token) {
        return null
    }

    const db = useDb()
    const now = new Date()

    const [row] = await db
        .select({ admin: schema.admins })
        .from(schema.adminSessions)
        .innerJoin(schema.admins, eq(schema.adminSessions.adminId, schema.admins.id))
        .where(and(eq(schema.adminSessions.token, token), gt(schema.adminSessions.expiresAt, now)))
        .limit(1)

    return row?.admin ?? null
}

export async function requireAdmin(c: Context) {
    const admin = await getCurrentAdmin(c)

    if (!admin) {
        throw new HTTPException(401, { message: 'Unauthorized' })
    }

    return admin
}

export { ADMIN_SESSION_COOKIE }
