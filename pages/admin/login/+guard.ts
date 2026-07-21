import type { PageContext } from 'vike/types'
import { redirect } from 'vike/abort'

export function guard(pageContext: PageContext) {
    if (pageContext.admin) {
        throw redirect('/admin/orders')
    }
}
