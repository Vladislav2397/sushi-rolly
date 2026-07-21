import type { MenuCategory, MenuProduct, MenuSet } from '@entities/menu'
import type { Order, OrderFulfillment, OrderStatus } from '@entities/order'
import type { User } from '@entities/user'

export type ApiMenuSet = MenuSet
export type ApiMenuProduct = MenuProduct

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
