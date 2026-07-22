import type { MenuCategory } from '@entities/menu'

export interface CartItem {
    productId: string
    category: MenuCategory
    title: string
    price: number
    quantity: number
    /** Номер сета — только для category === 'set' */
    number?: number
}
