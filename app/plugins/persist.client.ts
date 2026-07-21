import { useCartStore } from '@entities/cart'
import { useUserStore } from '@entities/user'

export default defineNuxtPlugin(async () => {
    useCartStore().hydrate()
    await useUserStore().fetchMe()
})
