import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { OrderCard } from '@entities/order'
import type { Order } from '@entities/order'

const deliveryOrder: Order = {
    id: 'ord_demo_abc123',
    userId: 'user-1',
    phone: '+79001234567',
    items: [
        {
            productId: 'set-1',
            category: 'set',
            title: 'Сет «Классика»',
            price: 1290,
            quantity: 1,
            number: 1,
        },
        {
            productId: 'drink-1',
            category: 'drink',
            title: 'Зелёный чай',
            price: 120,
            quantity: 2,
        },
    ],
    fulfillment: 'delivery',
    address: 'ул. Пушкина, д. 10, кв. 5',
    comment: 'Позвонить за 10 минут',
    subtotal: 1530,
    deliveryFee: 200,
    total: 1730,
    status: 'cooking',
    createdAt: '2026-07-21T15:30:00.000Z',
}

const pickupOrder: Order = {
    ...deliveryOrder,
    id: 'ord_demo_xyz789',
    fulfillment: 'pickup',
    address: null,
    comment: '',
    deliveryFee: 0,
    total: 1530,
    status: 'ready',
}

const meta = {
    title: 'Entities/OrderCard',
    component: OrderCard,
    tags: ['autodocs'],
    parameters: {
        layout: 'padded',
    },
} satisfies Meta<typeof OrderCard>

export default meta
type Story = StoryObj<typeof meta>

function renderCard(args: { order: Order }) {
    return {
        components: { OrderCard },
        setup: () => ({ args }),
        template: `
      <div class="max-w-lg">
        <OrderCard :order="args.order" />
      </div>
    `,
    }
}

export const Delivery: Story = {
    args: { order: deliveryOrder },
    render: renderCard,
}

export const Pickup: Story = {
    args: { order: pickupOrder },
    render: renderCard,
}
