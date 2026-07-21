import type { MenuCategory } from '@entities/menu'

export interface OrderItem {
    productId: string
    category: MenuCategory
    title: string
    price: number
    quantity: number
    number?: number
}
