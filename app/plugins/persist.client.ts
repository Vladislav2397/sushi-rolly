export default defineNuxtPlugin(() => {
    useUserStore().hydrate()
    useCartStore().hydrate()
    useOrderStore().hydrate()
})
