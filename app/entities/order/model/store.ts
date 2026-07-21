import type { CartItem } from '@entities/cart'
import type { Order, OrderFulfillment } from './types'
import { RESTAURANT, readStorage, uid, writeStorage } from '@shared'

const STORAGE_KEY = 'sushi-rolly:orders'

export function useOrderStore() {
    const orders = useState<Order[]>('orders', () => [])

    function persist() {
        writeStorage(STORAGE_KEY, orders.value)
    }

    function hydrate() {
        orders.value = readStorage<Order[]>(STORAGE_KEY, [])
    }

    function getOrdersByUser(userId: string) {
        return computed(() =>
            orders.value
                .filter((order) => order.userId === userId)
                .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt)),
        )
    }

    function calcDeliveryFee(subtotal: number, fulfillment: OrderFulfillment) {
        if (fulfillment === 'pickup') {
            return 0
        }
        if (subtotal >= RESTAURANT.freeDeliveryFrom) {
            return 0
        }
        return RESTAURANT.deliveryFee
    }

    function createOrder(input: {
        userId: string
        phone: string
        items: CartItem[]
        fulfillment: OrderFulfillment
        address: string | null
        comment: string
    }) {
        const subtotal = input.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
        const deliveryFee = calcDeliveryFee(subtotal, input.fulfillment)

        const order: Order = {
            id: uid('order'),
            userId: input.userId,
            phone: input.phone,
            items: input.items.map((item) => ({ ...item })),
            fulfillment: input.fulfillment,
            address: input.fulfillment === 'delivery' ? input.address : null,
            comment: input.comment.trim(),
            subtotal,
            deliveryFee,
            total: subtotal + deliveryFee,
            status: 'new',
            createdAt: new Date().toISOString(),
        }

        orders.value = [order, ...orders.value]
        persist()

        return order
    }

    return {
        orders,
        hydrate,
        getOrdersByUser,
        calcDeliveryFee,
        createOrder,
    }
}

export const ORDER_STATUS_LABEL: Record<Order['status'], string> = {
    new: 'Принят',
    cooking: 'Готовится',
    on_the_way: 'В пути',
    ready: 'Можно забирать',
    done: 'Выполнен',
}

export const ORDER_FULFILLMENT_LABEL: Record<OrderFulfillment, string> = {
    pickup: 'Самовывоз',
    delivery: 'Доставка',
}
