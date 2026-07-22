import type { MenuCategory } from '@entities/menu'

export type OrderFulfillment = 'pickup' | 'delivery'

export type OrderStatus = 'new' | 'cooking' | 'on_the_way' | 'ready' | 'done'

export interface OrderItem {
    productId: string
    category: MenuCategory
    title: string
    price: number
    quantity: number
    number?: number
}

export interface Order {
    id: string
    userId: string
    phone: string
    items: OrderItem[]
    fulfillment: OrderFulfillment
    address: string | null
    comment: string
    subtotal: number
    deliveryFee: number
    total: number
    status: OrderStatus
    createdAt: string
}
