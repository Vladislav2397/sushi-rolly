import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { UiBadge } from '@shared'

const meta = {
    title: 'Shared/UiBadge',
    component: UiBadge,
    tags: ['autodocs'],
    argTypes: {
        color: { control: 'select', options: ['primary', 'neutral'] },
        variant: { control: 'select', options: ['solid', 'subtle'] },
        size: { control: 'select', options: ['sm', 'md'] },
    },
} satisfies Meta<typeof UiBadge>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {
    args: { color: 'primary', variant: 'subtle' },
    render: (args) => ({
        components: { UiBadge },
        setup: () => ({ args }),
        template: '<UiBadge v-bind="args">хит</UiBadge>',
    }),
}

export const Solid: Story = {
    args: { color: 'primary', variant: 'solid', size: 'sm' },
    render: (args) => ({
        components: { UiBadge },
        setup: () => ({ args }),
        template: '<UiBadge v-bind="args">3</UiBadge>',
    }),
}
