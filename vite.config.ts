import { fileURLToPath, URL } from 'node:url'
import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import vike from 'vike/plugin'
import { defineConfig } from 'vite'

export default defineConfig({
    plugins: [vue(), vike(), tailwindcss()],
    resolve: {
        alias: {
            '@shared': fileURLToPath(new URL('./app/shared', import.meta.url)),
            '@entities': fileURLToPath(new URL('./app/entities', import.meta.url)),
            '@features': fileURLToPath(new URL('./app/features', import.meta.url)),
            '@widgets': fileURLToPath(new URL('./app/widgets', import.meta.url)),
            '@pages': fileURLToPath(new URL('./app/pages', import.meta.url)),
        },
    },
})
