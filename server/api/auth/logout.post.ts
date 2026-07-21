import { eq } from 'drizzle-orm'
import { useDb, schema } from '../../database/client'
import { clearSessionCookie, getSessionToken } from '../../utils/auth'

export default defineEventHandler(async (event) => {
    const token = getSessionToken(event)

    if (token) {
        const db = useDb()
        await db.delete(schema.sessions).where(eq(schema.sessions.token, token))
    }

    clearSessionCookie(event)

    return { ok: true }
})
