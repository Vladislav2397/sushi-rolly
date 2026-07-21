import type { PageContextServer } from 'vike/types'
import { redirect } from 'vike/abort'

export function guard(pageContext: PageContextServer) {
    if (!pageContext.user) {
        throw redirect('/auth?redirect=/checkout')
    }
}
