import type { PageContextServer } from 'vike/types'
import { and, eq, gt } from 'drizzle-orm'
import { useDb, schema } from '../server/database/client'
import { SESSION_COOKIE } from '../server/utils/auth'
import { mapUser } from '../server/utils/session'

function readCookie(pageContext: PageContextServer): string | undefined {
    const candidates: Array<string | null | undefined> = []

    const anyCtx = pageContext as Record<string, unknown>

    // Vike may expose headers in different shapes depending on adapter
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

    const cookieHeader = candidates.find((value) => typeof value === 'string' && value.length > 0)
    if (!cookieHeader) {
        return undefined
    }

    const match = cookieHeader.match(new RegExp(`(?:^|;\\s*)${SESSION_COOKIE}=([^;]*)`))
    return match?.[1] ? decodeURIComponent(match[1]) : undefined
}

export async function onCreatePageContext(pageContext: PageContextServer) {
    try {
        const req = pageContext.req as { get?: (key: string) => unknown } | undefined
        if (typeof req?.get === 'function') {
            const fromContext = req.get('user') as PageContextServer['user'] | undefined
            if (fromContext !== undefined) {
                pageContext.user = fromContext
                return
            }
        }

        const token = readCookie(pageContext)
        if (!token) {
            pageContext.user = null
            return
        }

        const db = useDb()
        const now = new Date()
        const [row] = await db
            .select({ user: schema.users })
            .from(schema.sessions)
            .innerJoin(schema.users, eq(schema.sessions.userId, schema.users.id))
            .where(and(eq(schema.sessions.token, token), gt(schema.sessions.expiresAt, now)))
            .limit(1)

        pageContext.user = row?.user ? mapUser(row.user) : null
    } catch (error) {
        console.error('[onCreatePageContext] failed to resolve user', error)
        pageContext.user = null
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
        }
    }
}
