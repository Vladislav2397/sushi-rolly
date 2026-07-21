import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { UiButton } from '@shared'

const meta = {
    title: 'Shared/UiButton',
    component: UiButton,
    tags: ['autodocs'],
    argTypes: {
        color: { control: 'select', options: ['primary', 'neutral'] },
        variant: { control: 'select', options: ['solid', 'soft', 'ghost', 'outline', 'link'] },
        size: { control: 'select', options: ['xs', 'sm', 'md', 'lg', 'xl'] },
    },
    args: {
        color: 'primary',
        variant: 'solid',
        size: 'md',
    },
} satisfies Meta<typeof UiButton>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {
    render: (args) => ({
        components: { UiButton },
        setup: () => ({ args }),
        template: '<UiButton v-bind="args">Заказать</UiButton>',
    }),
}

export const Soft: Story = {
    args: { variant: 'soft' },
    render: (args) => ({
        components: { UiButton },
        setup: () => ({ args }),
        template: '<UiButton v-bind="args">В корзину</UiButton>',
    }),
}

export const WithIcon: Story = {
    args: { icon: 'i-lucide-shopping-bag' },
    render: (args) => ({
        components: { UiButton },
        setup: () => ({ args }),
        template: '<UiButton v-bind="args">Корзина</UiButton>',
    }),
}

export const Loading: Story = {
    args: { loading: true },
    render: (args) => ({
        components: { UiButton },
        setup: () => ({ args }),
        template: '<UiButton v-bind="args">Отправка…</UiButton>',
    }),
}

export const AsLink: Story = {
    args: { to: '/cart', variant: 'outline', color: 'neutral' },
    render: (args) => ({
        components: { UiButton },
        setup: () => ({ args }),
        template: '<UiButton v-bind="args">Перейти в корзину</UiButton>',
    }),
}
