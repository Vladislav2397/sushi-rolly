// https://nuxt.com/docs/api/configuration/nuxt-config
import { fileURLToPath } from 'node:url'

export default defineNuxtConfig({
    compatibilityDate: '2025-07-15',
    devtools: { enabled: true },
    modules: ['@nuxt/ui'],
    css: ['~/assets/css/main.css'],
    alias: {
        '@shared': fileURLToPath(new URL('./app/shared', import.meta.url)),
        '@entities': fileURLToPath(new URL('./app/entities', import.meta.url)),
        '@features': fileURLToPath(new URL('./app/features', import.meta.url)),
        '@widgets': fileURLToPath(new URL('./app/widgets', import.meta.url)),
    },
    components: [
        { path: '~/entities', pathPrefix: false, pattern: '**/ui/*.vue' },
        { path: '~/features', pathPrefix: false, pattern: '**/ui/*.vue' },
        { path: '~/widgets', pathPrefix: false, pattern: '**/ui/*.vue' },
    ],
    imports: {
        dirs: [
            'shared/lib',
            'shared/config',
            'entities/*/model',
            'features/*/model',
            'widgets/*/model',
        ],
    },
    colorMode: {
        preference: 'light',
        fallback: 'light',
    },
    fonts: {
        families: [
            { name: 'Syne', provider: 'google' },
            { name: 'Manrope', provider: 'google' },
        ],
    },
})
