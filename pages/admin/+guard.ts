import type { PageContext } from 'vike/types'
import { redirect } from 'vike/abort'

export async function guard(pageContext: PageContext) {
    const path = pageContext.urlPathname

    if (path === '/admin/login') {
        return
    }

    if (pageContext.admin) {
        return
    }

    // SPA client navigation: cookie may exist while pageContext.admin is stale
    if (typeof window !== 'undefined') {
        try {
            const response = await fetch('/api/admin/auth/me', { credentials: 'include' })
            const data = (await response.json()) as { admin: PageContext['admin'] }
            if (data.admin) {
                pageContext.admin = data.admin
                return
            }
        } catch {
            // fall through to redirect
        }
    }

    throw redirect('/admin/login')
}
