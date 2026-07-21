export type MenuCategory = 'set' | 'sushi' | 'roll' | 'drink'

export interface MenuSet {
    id: string
    category: 'set'
    number: 1 | 2 | 3 | 4 | 5 | 6
    title: string
    description: string
    pieces: number
    weight: number
    price: number
    tags: string[]
    accent: string
}

export interface MenuProduct {
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

export type MenuItem = MenuSet | MenuProduct
