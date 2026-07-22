/// <reference types="vitest/config" />
import { fileURLToPath, URL } from 'node:url'
import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import vike from 'vike/plugin'
import { defineConfig } from 'vitest/config'

export default defineConfig({
    plugins: [vue(), vike(), tailwindcss()],
    resolve: {
        alias: {
            '@shared': fileURLToPath(new URL('./src/shared', import.meta.url)),
            '@entities': fileURLToPath(new URL('./src/entities', import.meta.url)),
            '@features': fileURLToPath(new URL('./src/features', import.meta.url)),
            '@widgets': fileURLToPath(new URL('./src/widgets', import.meta.url)),
            '@pages': fileURLToPath(new URL('./src/pages', import.meta.url)),
            'vike/client/router': fileURLToPath(
                new URL('./.storybook/mocks/vike-router.ts', import.meta.url),
            ),
        },
    },
    test: {
        environment: 'happy-dom',
        setupFiles: ['./vitest.setup.ts'],
        include: ['src/**/*.spec.ts'],
        css: false,
    },
})
