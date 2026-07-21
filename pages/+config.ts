import type { Config } from 'vike/types'
import vikeVue from 'vike-vue/config'

export default {
    extends: [vikeVue],
    passToClient: ['user', 'admin'],
} satisfies Config

declare global {
    namespace Vike {
        interface Server {
            server: 'hono'
        }
    }
}
