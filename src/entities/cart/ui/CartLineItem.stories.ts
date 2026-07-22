import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { CartLineItem } from '@entities/cart'
import type { CartItem } from '@entities/cart'
import { UiButton } from '@shared'

const setItem: CartItem = {
    productId: 'set-1',
    category: 'set',
    title: 'Сет «Классика»',
    price: 1290,
    quantity: 1,
    number: 1,
}

const rollItem: CartItem = {
    productId: 'roll-1',
    category: 'roll',
    title: 'Филадельфия',
    price: 420,
    quantity: 2,
}

const meta = {
    title: 'Entities/CartLineItem',
    component: CartLineItem,
    tags: ['autodocs'],
    parameters: {
        layout: 'padded',
    },
} satisfies Meta<typeof CartLineItem>

export default meta
type Story = StoryObj<typeof meta>

function renderLine(args: { item: CartItem }) {
    return {
        components: { CartLineItem, UiButton },
        setup: () => ({ args }),
        template: `
      <div class="max-w-xl">
        <CartLineItem :item="args.item">
          <template #decrement>
            <UiButton icon="i-lucide-minus" color="neutral" variant="soft" size="sm" square />
          </template>
          <template #increment>
            <UiButton icon="i-lucide-plus" color="neutral" variant="soft" size="sm" square />
          </template>
          <template #remove>
            <UiButton color="neutral" variant="link" size="xs" class="px-0">Удалить</UiButton>
          </template>
        </CartLineItem>
      </div>
    `,
    }
}

export const Set: Story = {
    args: { item: setItem },
    render: renderLine,
}

export const Product: Story = {
    args: { item: rollItem },
    render: renderLine,
}
