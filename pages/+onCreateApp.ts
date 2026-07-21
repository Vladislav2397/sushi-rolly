export { onCreateApp }

import { createPinia } from 'pinia'
import type { PageContext } from 'vike/types'

function onCreateApp(pageContext: PageContext) {
    if (pageContext.isRenderingHead) {
        return
    }

    pageContext.app!.use(createPinia())
}
