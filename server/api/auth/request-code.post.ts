import { eq } from 'drizzle-orm'
import { useDb, schema } from '../../database/client'
import { getAuthCodeExpiry, isValidPhone, normalizePhone } from '../../utils/auth'

export default defineEventHandler(async (event) => {
    const body = await readBody<{ phone?: string }>(event)

    if (!body.phone || !isValidPhone(body.phone)) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Invalid phone number',
        })
    }

    const phone = normalizePhone(body.phone)
    const config = useRuntimeConfig()
    const code = String(config.demoOtpCode)
    const db = useDb()

    await db.delete(schema.authCodes).where(eq(schema.authCodes.phone, phone))

    await db.insert(schema.authCodes).values({
        phone,
        code,
        expiresAt: getAuthCodeExpiry(),
    })

    return { ok: true }
})
