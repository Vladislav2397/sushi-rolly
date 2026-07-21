import type { Context } from 'hono'
import { HTTPException } from 'hono/http-exception'
import { and, eq, gt } from 'drizzle-orm'
import { useDb, schema } from '../database/client'
import { getSessionToken } from './auth'

export async function getCurrentUser(c: Context) {
    const token = getSessionToken(c)
    if (!token) {
        return null
    }

    const db = useDb()
    const now = new Date()

    const [row] = await db
        .select({ user: schema.users })
        .from(schema.sessions)
        .innerJoin(schema.users, eq(schema.sessions.userId, schema.users.id))
        .where(and(eq(schema.sessions.token, token), gt(schema.sessions.expiresAt, now)))
        .limit(1)

    return row?.user ?? null
}

export async function requireUser(c: Context) {
    const user = await getCurrentUser(c)

    if (!user) {
        throw new HTTPException(401, { message: 'Unauthorized' })
    }

    return user
}

export function mapUser(user: typeof schema.users.$inferSelect) {
    return {
        id: user.id,
        phone: user.phone,
        createdAt: user.createdAt.toISOString(),
    }
}
