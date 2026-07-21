// https://nuxt.com/docs/api/configuration/nuxt-config
import { fileURLToPath } from 'node:url'

export default defineNuxtConfig({
    compatibilityDate: '2025-07-15',
    devtools: { enabled: true },
    modules: ['@nuxt/ui'],
    css: ['~/assets/css/main.css'],
    runtimeConfig: {
        databaseUrl: process.env.DATABASE_URL || '',
        sessionSecret: process.env.SESSION_SECRET || 'dev-secret',
        demoOtpCode: process.env.DEMO_OTP_CODE || '1234',
    },
    alias: {
        '@shared': fileURLToPath(new URL('./app/shared', import.meta.url)),
        '@entities': fileURLToPath(new URL('./app/entities', import.meta.url)),
        '@features': fileURLToPath(new URL('./app/features', import.meta.url)),
        '@widgets': fileURLToPath(new URL('./app/widgets', import.meta.url)),
    },
    // FSD UI и model — только через public API (@entities/*, @features/*, @widgets/*, @shared)
    imports: {
        dirs: [],
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
