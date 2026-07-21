export function api<T>(url: string, options?: Parameters<typeof $fetch>[1]) {
    return $fetch<T>(url, {
        ...options,
        credentials: 'include',
    })
}
