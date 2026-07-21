import { $fetch, type FetchOptions } from 'ofetch'

export function api<T>(url: string, options?: FetchOptions<'json'>) {
    return $fetch<T>(url, {
        ...options,
        credentials: 'include',
    })
}
