import type { MenuCategory } from '@entities/menu'
import type { Order, OrderFulfillment, OrderStatus } from '@entities/order'
import type { User } from '@entities/user'

export interface ApiMenuSet {
    id: string
    category: 'set'
    number: number
    title: string
    description: string
    pieces: number
    weight: number
    price: number
    tags: string[]
    accent: string
}

export interface ApiMenuProduct {
    id: string
    category: 'sushi' | 'roll' | 'drink'
    title: string
    description: string
    price: number
    tags: string[]
    pieces?: number
    weight?: number
    volume?: number
}

export interface ApiMenuResponse {
    sets: ApiMenuSet[]
    sushi: ApiMenuProduct[]
    rolls: ApiMenuProduct[]
    drinks: ApiMenuProduct[]
}

export interface ApiUserResponse {
    user: User | null
}

export interface ApiOrdersResponse {
    orders: Order[]
}

export interface ApiCreateOrderResponse {
    order: Order
}

export interface ApiOrderItemInput {
    productId: string
    quantity: number
}

export interface ApiCreateOrderBody {
    items: ApiOrderItemInput[]
    fulfillment: OrderFulfillment
    address: string | null
    comment: string
}

export type { MenuCategory, OrderStatus }
