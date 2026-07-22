import { fileURLToPath, URL } from 'node:url'
import type { StorybookConfig } from '@storybook/vue3-vite'
import tailwindcss from '@tailwindcss/vite'
import { mergeConfig } from 'vite'

const config: StorybookConfig = {
    stories: ['../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
    addons: [
        '@chromatic-com/storybook',
        '@storybook/addon-vitest',
        '@storybook/addon-a11y',
        '@storybook/addon-docs',
    ],
    framework: {
        name: '@storybook/vue3-vite',
        options: {},
    },
    async viteFinal(config) {
        return mergeConfig(config, {
            plugins: [tailwindcss()],
            resolve: {
                alias: {
                    '@shared': fileURLToPath(new URL('../src/shared', import.meta.url)),
                    '@entities': fileURLToPath(new URL('../src/entities', import.meta.url)),
                    '@features': fileURLToPath(new URL('../src/features', import.meta.url)),
                    '@widgets': fileURLToPath(new URL('../src/widgets', import.meta.url)),
                    '@pages': fileURLToPath(new URL('../src/pages', import.meta.url)),
                    'vike/client/router': fileURLToPath(
                        new URL('./mocks/vike-router.ts', import.meta.url),
                    ),
                },
            },
        })
    },
}

export default config
