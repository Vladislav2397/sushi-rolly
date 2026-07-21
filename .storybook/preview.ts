import type { Preview } from '@storybook/vue3-vite'
import { setup } from '@storybook/vue3'
import { createPinia } from 'pinia'
import { UiToaster } from '../app/shared'
import '../app/assets/css/main.css'

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
    },
    initialGlobals: {
        backgrounds: { value: 'light' },
    },
    decorators: [
        () => ({
            components: { UiToaster },
            template: `
        <div class="min-w-[20rem] font-sans text-ink-950">
          <story />
          <UiToaster />
        </div>
      `,
        }),
    ],
}

export default preview
