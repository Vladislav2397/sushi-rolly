import { and, eq, gt } from 'drizzle-orm'
import { useDb, schema } from '../../database/client'
import {
    createSessionToken,
    getSessionExpiry,
    isValidPhone,
    normalizePhone,
    setSessionCookie,
} from '../../utils/auth'
import { mapUser } from '../../utils/session'

export default defineEventHandler(async (event) => {
    const body = await readBody<{ phone?: string; code?: string }>(event)

    if (!body.phone || !isValidPhone(body.phone)) {
        throw createError({ statusCode: 400, statusMessage: 'Invalid phone number' })
    }

    if (!body.code || body.code.length !== 4) {
        throw createError({ statusCode: 400, statusMessage: 'Invalid code' })
    }

    const phone = normalizePhone(body.phone)
    const db = useDb()
    const now = new Date()

    const [authCode] = await db
        .select()
        .from(schema.authCodes)
        .where(
            and(
                eq(schema.authCodes.phone, phone),
                eq(schema.authCodes.code, body.code),
                gt(schema.authCodes.expiresAt, now),
            ),
        )
        .limit(1)

    if (!authCode) {
        throw createError({ statusCode: 401, statusMessage: 'Invalid or expired code' })
    }

    await db.delete(schema.authCodes).where(eq(schema.authCodes.phone, phone))

    let [user] = await db.select().from(schema.users).where(eq(schema.users.phone, phone)).limit(1)

    if (!user) {
        ;[user] = await db.insert(schema.users).values({ phone }).returning()
    }

    const token = createSessionToken()
    const expiresAt = getSessionExpiry()

    await db.insert(schema.sessions).values({
        userId: user.id,
        token,
        expiresAt,
    })

    setSessionCookie(event, token, expiresAt)

    return { user: mapUser(user) }
})
