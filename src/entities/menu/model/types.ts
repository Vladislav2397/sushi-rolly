import type { ApiMenuCategory, ApiMenuProduct, ApiMenuSet } from '@shared/api'

export type MenuCategory = ApiMenuCategory
export type MenuSet = ApiMenuSet
export type MenuProduct = ApiMenuProduct
export type MenuItem = MenuSet | MenuProduct
