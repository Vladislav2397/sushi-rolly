export default defineNuxtRouteMiddleware(async (to) => {
    if (import.meta.server) {
        return
    }

    const store = useUserStore()

    if (!store.authReady.value) {
        await store.fetchMe()
    }

    if (!store.isAuthenticated.value) {
        return navigateTo({
            path: '/auth',
            query: { redirect: to.fullPath },
        })
    }
})
