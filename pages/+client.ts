export { client }

import { usePageContext } from 'vike-vue/usePageContext'
import { useCartStore } from '@entities/cart'
import { useUserStore } from '@entities/user'

async function client() {
    const pageContext = usePageContext()
    const userStore = useUserStore()
    const cartStore = useCartStore()

    cartStore.hydrate()

    if (pageContext.user) {
        userStore.user = pageContext.user
        userStore.authReady = true
    } else {
        await userStore.fetchMe()
    }
}
