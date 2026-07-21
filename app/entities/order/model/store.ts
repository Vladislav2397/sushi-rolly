import type { Order, OrderFulfillment } from './types'
import type { CartItem } from '@entities/cart'
import {
    api,
    type ApiCreateOrderBody,
    type ApiCreateOrderResponse,
    type ApiOrdersResponse,
} from '@shared/api'
import { RESTAURANT } from '@shared'

export function useOrderStore() {
    const orders = useState<Order[]>('orders', () => [])
    const ordersLoaded = useState('orders-loaded', () => false)

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

    async function fetchOrders() {
        const data = await api<ApiOrdersResponse>('/api/orders')
        orders.value = data.orders
        ordersLoaded.value = true
    }

    async function createOrder(input: {
        userId: string
        phone: string
        items: CartItem[]
        fulfillment: OrderFulfillment
        address: string | null
        comment: string
    }) {
        const body: ApiCreateOrderBody = {
            items: input.items.map((item) => ({
                productId: item.productId,
                quantity: item.quantity,
            })),
            fulfillment: input.fulfillment,
            address: input.address,
            comment: input.comment,
        }

        const data = await api<ApiCreateOrderResponse>('/api/orders', {
            method: 'POST',
            body,
        })

        orders.value = [data.order, ...orders.value]
        ordersLoaded.value = true

        return data.order
    }

    return {
        orders,
        ordersLoaded,
        getOrdersByUser,
        calcDeliveryFee,
        fetchOrders,
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
