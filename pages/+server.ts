import 'dotenv/config'
import { Hono } from 'hono'
import { getCookie } from 'hono/cookie'
import vike from '@vikejs/hono'
import type { Server } from 'vike/types'
import { and, eq, gt } from 'drizzle-orm'
import { api } from '../server/api'
import { adminApi } from '../server/api/admin'
import { useDb, schema } from '../server/database/client'
import { SESSION_COOKIE } from '../server/utils/auth'
import { ADMIN_SESSION_COOKIE, mapAdmin } from '../server/utils/admin-auth'
import { mapUser } from '../server/utils/session'

type Variables = {
    user: {
        id: string
        phone: string
        createdAt: string
    } | null
    admin: {
        id: string
        email: string
        createdAt: string
    } | null
}

const app = new Hono<{ Variables: Variables }>()

app.use('*', async (c, next) => {
    const userToken = getCookie(c, SESSION_COOKIE)
    const adminToken = getCookie(c, ADMIN_SESSION_COOKIE)
    let user: Variables['user'] = null
    let admin: Variables['admin'] = null

    try {
        const db = useDb()
        const now = new Date()

        if (userToken) {
            const [row] = await db
                .select({ user: schema.users })
                .from(schema.sessions)
                .innerJoin(schema.users, eq(schema.sessions.userId, schema.users.id))
                .where(and(eq(schema.sessions.token, userToken), gt(schema.sessions.expiresAt, now)))
                .limit(1)

            user = row?.user ? mapUser(row.user) : null
        }

        if (adminToken) {
            const [row] = await db
                .select({ admin: schema.admins })
                .from(schema.adminSessions)
                .innerJoin(schema.admins, eq(schema.adminSessions.adminId, schema.admins.id))
                .where(
                    and(eq(schema.adminSessions.token, adminToken), gt(schema.adminSessions.expiresAt, now)),
                )
                .limit(1)

            admin = row?.admin ? mapAdmin(row.admin) : null
        }
    } catch (error) {
        console.error('[auth middleware] failed to resolve session', error)
    }

    c.set('user', user)
    c.set('admin', admin)
    await next()
})

app.route('/api', api)
app.route('/api/admin', adminApi)
vike(app)

export default {
    fetch: app.fetch,
} satisfies Server
