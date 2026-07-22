import type { MenuCategory } from './types'

export const MENU_CATEGORY_LABEL: Record<MenuCategory, string> = {
    set: 'Сеты',
    sushi: 'Суши',
    roll: 'Роллы',
    drink: 'Напитки',
}

export const MENU_CATEGORY_ICON: Record<MenuCategory, string> = {
    set: 'i-lucide-layout-grid',
    sushi: 'i-lucide-fish',
    roll: 'i-lucide-scroll',
    drink: 'i-lucide-cup-soda',
}

export const MENU_CATEGORY_ACCENT: Record<MenuCategory, string> = {
    set: '#f24d2c',
    sushi: '#0ea5e9',
    roll: '#10b981',
    drink: '#8b5cf6',
}
