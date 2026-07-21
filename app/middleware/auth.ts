export default defineNuxtRouteMiddleware((to) => {
    // Сессия в localStorage — проверка только на клиенте
    if (import.meta.server) {
        return
    }

    const store = useUserStore()
    store.hydrate()

    if (!store.isAuthenticated.value) {
        return navigateTo({
            path: '/auth',
            query: { redirect: to.fullPath },
        })
    }
})
