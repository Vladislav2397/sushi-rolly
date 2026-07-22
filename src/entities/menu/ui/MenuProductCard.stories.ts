import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { MenuProductCard } from '@entities/menu'
import type { MenuProduct } from '@entities/menu'

const roll: MenuProduct = {
    id: 'roll-1',
    category: 'roll',
    title: 'Филадельфия',
    description: 'Лосось, сливочный сыр, огурец, рис, нори.',
    price: 420,
    pieces: 8,
    weight: 240,
    tags: ['лосось', 'хит'],
}

const sushi: MenuProduct = {
    id: 'sushi-1',
    category: 'sushi',
    title: 'Суши с угрём',
    description: 'Копчёный угорь, рис, нори, унаги-соус.',
    price: 190,
    pieces: 1,
    weight: 40,
    tags: ['угорь'],
}

const drink: MenuProduct = {
    id: 'drink-1',
    category: 'drink',
    title: 'Зелёный чай',
    description: 'Классический японский зелёный чай.',
    price: 120,
    volume: 300,
    tags: [],
}

const meta = {
    title: 'Entities/MenuProductCard',
    component: MenuProductCard,
    tags: ['autodocs'],
    parameters: {
        layout: 'padded',
    },
} satisfies Meta<typeof MenuProductCard>

export default meta
type Story = StoryObj<typeof meta>

function renderCard(args: { item: MenuProduct }) {
    return {
        components: { MenuProductCard },
        setup: () => ({ args }),
        template: `
      <div class="max-w-sm">
        <MenuProductCard :item="args.item" @add="() => {}" />
      </div>
    `,
    }
}

export const Roll: Story = {
    args: { item: roll },
    render: renderCard,
}

export const Sushi: Story = {
    args: { item: sushi },
    render: renderCard,
}

export const Drink: Story = {
    args: { item: drink },
    render: renderCard,
}
