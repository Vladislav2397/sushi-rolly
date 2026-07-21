import type { PageContextServer } from 'vike/types'
import { and, eq, gt } from 'drizzle-orm'
import { useDb, schema } from '../server/database/client'
import { SESSION_COOKIE } from '../server/utils/auth'
import { ADMIN_SESSION_COOKIE, mapAdmin } from '../server/utils/admin-auth'
import { mapUser } from '../server/utils/session'

function readCookieHeader(pageContext: PageContextServer): string | undefined {
    const candidates: Array<string | null | undefined> = []
    const anyCtx = pageContext as Record<string, unknown>

    for (const key of ['headersOriginal', 'headers', 'httpRequestHeaders']) {
        const value = anyCtx[key]
        if (!value) continue
        if (typeof (value as Headers).get === 'function') {
            candidates.push((value as Headers).get('cookie'))
        } else if (typeof value === 'object') {
            const record = value as Record<string, string | string[] | undefined>
            const cookie = record.cookie ?? record.Cookie
            candidates.push(Array.isArray(cookie) ? cookie.join(';') : cookie)
        }
    }

    const req = pageContext.req as
        | {
              header?: (name: string) => string | undefined
              headers?: Headers | Record<string, string>
              raw?: Request
              get?: (key: string) => unknown
          }
        | undefined

    if (req) {
        if (typeof req.header === 'function') {
            candidates.push(req.header('cookie'))
        }
        if (req.headers) {
            if (typeof (req.headers as Headers).get === 'function') {
                candidates.push((req.headers as Headers).get('cookie'))
            } else {
                const record = req.headers as Record<string, string>
                candidates.push(record.cookie || record.Cookie)
            }
        }
        if (req.raw?.headers) {
            candidates.push(req.raw.headers.get('cookie'))
        }
    }

    return candidates.find((value): value is string => typeof value === 'string' && value.length > 0)
}

function getCookieValue(cookieHeader: string | undefined, name: string): string | undefined {
    if (!cookieHeader) {
        return undefined
    }

    const match = cookieHeader.match(new RegExp(`(?:^|;\\s*)${name}=([^;]*)`))
    return match?.[1] ? decodeURIComponent(match[1]) : undefined
}

export async function onCreatePageContext(pageContext: PageContextServer) {
    try {
        const req = pageContext.req as { get?: (key: string) => unknown } | undefined

        if (typeof req?.get === 'function') {
            const fromUser = req.get('user') as PageContextServer['user'] | undefined
            const fromAdmin = req.get('admin') as PageContextServer['admin'] | undefined

            if (fromUser !== undefined || fromAdmin !== undefined) {
                pageContext.user = fromUser ?? null
                pageContext.admin = fromAdmin ?? null
                return
            }
        }

        const cookieHeader = readCookieHeader(pageContext)
        const userToken = getCookieValue(cookieHeader, SESSION_COOKIE)
        const adminToken = getCookieValue(cookieHeader, ADMIN_SESSION_COOKIE)

        pageContext.user = null
        pageContext.admin = null

        if (!userToken && !adminToken) {
            return
        }

        const db = useDb()
        const now = new Date()

        if (userToken) {
            const [row] = await db
                .select({ user: schema.users })
                .from(schema.sessions)
                .innerJoin(schema.users, eq(schema.sessions.userId, schema.users.id))
                .where(and(eq(schema.sessions.token, userToken), gt(schema.sessions.expiresAt, now)))
                .limit(1)

            pageContext.user = row?.user ? mapUser(row.user) : null
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

            pageContext.admin = row?.admin ? mapAdmin(row.admin) : null
        }
    } catch (error) {
        console.error('[onCreatePageContext] failed to resolve session', error)
        pageContext.user = null
        pageContext.admin = null
    }
}

declare global {
    namespace Vike {
        interface PageContext {
            user?: {
                id: string
                phone: string
                createdAt: string
            } | null
            admin?: {
                id: string
                email: string
                createdAt: string
            } | null
        }
    }
}
