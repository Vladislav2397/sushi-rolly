import type { Preview } from '@storybook/vue3-vite'
import { setup } from '@storybook/vue3'
import { createPinia } from 'pinia'
import { UiToaster } from '../src/shared'
import { patchStorybookFocusInstrumentation } from './patch-focus'
import '../src/assets/css/main.css'

patchStorybookFocusInstrumentation()

setup((app) => {
    app.use(createPinia())
})

const preview: Preview = {
    parameters: {
        controls: {
            matchers: {
                color: /(background|color)$/i,
                date: /Date$/i,
            },
        },
        layout: 'centered',
        backgrounds: {
            options: {
                light: { name: 'Light', value: '#f4f6f7' },
                white: { name: 'White', value: '#ffffff' },
            },
        },
        a11y: {
            test: 'todo',
        },
        docs: {
            story: {
                inline: true,
            },
        },
    },
    initialGlobals: {
        backgrounds: { value: 'light' },
    },
    decorators: [
        () => {
            patchStorybookFocusInstrumentation()
            return {
                components: { UiToaster },
                template: `
          <div class="min-w-[20rem] font-sans text-ink-950">
            <story />
            <UiToaster />
          </div>
        `,
            }
        },
    ],
}

export default preview
