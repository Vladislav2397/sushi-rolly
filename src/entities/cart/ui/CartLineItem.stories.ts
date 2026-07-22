import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { CartLineItem } from '@entities/cart'
import type { CartItem } from '@entities/cart'

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
        components: { CartLineItem },
        setup: () => ({ args }),
        template: `
      <div class="max-w-xl">
        <CartLineItem
          :item="args.item"
          @increment="() => {}"
          @decrement="() => {}"
          @remove="() => {}"
        />
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
