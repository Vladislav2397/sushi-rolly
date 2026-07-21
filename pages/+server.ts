import 'dotenv/config'
import { Hono } from 'hono'
import { getCookie } from 'hono/cookie'
import vike from '@vikejs/hono'
import type { Server } from 'vike/types'
import { and, eq, gt } from 'drizzle-orm'
import { api } from '../server/api'
import { useDb, schema } from '../server/database/client'
import { SESSION_COOKIE } from '../server/utils/auth'
import { mapUser } from '../server/utils/session'

type Variables = {
    user: {
        id: string
        phone: string
        createdAt: string
    } | null
}

const app = new Hono<{ Variables: Variables }>()

app.use('*', async (c, next) => {
    const token = getCookie(c, SESSION_COOKIE)
    let user: Variables['user'] = null

    if (token) {
        try {
            const db = useDb()
            const now = new Date()
            const [row] = await db
                .select({ user: schema.users })
                .from(schema.sessions)
                .innerJoin(schema.users, eq(schema.sessions.userId, schema.users.id))
                .where(and(eq(schema.sessions.token, token), gt(schema.sessions.expiresAt, now)))
                .limit(1)

            user = row?.user ? mapUser(row.user) : null
        } catch (error) {
            console.error('[auth middleware] failed to resolve user', error)
        }
    }

    c.set('user', user)
    await next()
})

app.route('/api', api)
vike(app)

export default {
    fetch: app.fetch,
} satisfies Server
