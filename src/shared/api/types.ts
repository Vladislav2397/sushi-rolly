export type ApiMenuCategory = 'set' | 'sushi' | 'roll' | 'drink'

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
    /** Количество штук (суши, роллы) */
    pieces?: number
    /** Вес в граммах */
    weight?: number
    /** Объём в мл (напитки) */
    volume?: number
}

export interface ApiMenuResponse {
    sets: ApiMenuSet[]
    sushi: ApiMenuProduct[]
    rolls: ApiMenuProduct[]
    drinks: ApiMenuProduct[]
}

export interface ApiUser {
    id: string
    phone: string
    createdAt: string
}

export interface ApiUserResponse {
    user: ApiUser | null
}

export type ApiOrderFulfillment = 'pickup' | 'delivery'

export type ApiOrderStatus = 'new' | 'cooking' | 'on_the_way' | 'ready' | 'done'

export interface ApiOrderItem {
    productId: string
    category: ApiMenuCategory
    title: string
    price: number
    quantity: number
    number?: number
}

export interface ApiOrder {
    id: string
    userId: string
    phone: string
    items: ApiOrderItem[]
    fulfillment: ApiOrderFulfillment
    address: string | null
    comment: string
    subtotal: number
    deliveryFee: number
    total: number
    status: ApiOrderStatus
    createdAt: string
}

export interface ApiOrdersResponse {
    orders: ApiOrder[]
}

export interface ApiCreateOrderResponse {
    order: ApiOrder
}

export interface ApiOrderItemInput {
    productId: string
    quantity: number
}

export interface ApiCreateOrderBody {
    items: ApiOrderItemInput[]
    fulfillment: ApiOrderFulfillment
    address: string | null
    comment: string
}
