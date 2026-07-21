export default defineNuxtPlugin(async () => {
    useCartStore().hydrate()
    await useUserStore().fetchMe()
})
