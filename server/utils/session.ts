import type { H3Event } from 'h3'
import { and, eq, gt } from 'drizzle-orm'
import { useDb, schema } from '../database/client'
import { getSessionToken } from './auth'

export async function getCurrentUser(event: H3Event) {
    const token = getSessionToken(event)
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

export async function requireUser(event: H3Event) {
    const user = await getCurrentUser(event)

    if (!user) {
        throw createError({
            statusCode: 401,
            statusMessage: 'Unauthorized',
        })
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
