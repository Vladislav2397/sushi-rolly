export { client }

import { usePageContext } from 'vike-vue/usePageContext'
import { useAdminStore } from '@entities/admin'

async function client() {
    const pageContext = usePageContext()
    const adminStore = useAdminStore()

    if (pageContext.admin) {
        adminStore.admin = pageContext.admin
        adminStore.authReady = true
    } else {
        await adminStore.fetchMe()
    }
}
