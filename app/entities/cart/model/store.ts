import type { CartItem } from './types'
import type { MenuProduct, MenuSet } from '@entities/menu'
import { readStorage, writeStorage } from '@shared'

const STORAGE_KEY = 'sushi-rolly:cart'

function toCartItem(product: MenuSet | MenuProduct, quantity: number): CartItem {
    if (product.category === 'set') {
        return {
            productId: product.id,
            category: product.category,
            title: product.title,
            price: product.price,
            quantity,
            number: product.number,
        }
    }

    return {
        productId: product.id,
        category: product.category,
        title: product.title,
        price: product.price,
        quantity,
    }
}

export function useCartStore() {
    const items = useState<CartItem[]>('cart-items', () => [])

    const totalCount = computed(() => items.value.reduce((sum, item) => sum + item.quantity, 0))

    const totalPrice = computed(() =>
        items.value.reduce((sum, item) => sum + item.price * item.quantity, 0),
    )

    const isEmpty = computed(() => items.value.length === 0)

    function persist() {
        writeStorage(STORAGE_KEY, items.value)
    }

    function hydrate() {
        const stored = readStorage<CartItem[]>(STORAGE_KEY, [])
        // миграция со старого формата (setId → productId)
        items.value = stored.map((item) => ({
            ...item,
            productId: item.productId ?? (item as unknown as { setId?: string }).setId ?? '',
            category: item.category ?? 'set',
        }))
    }

    function addProduct(product: MenuSet | MenuProduct, quantity = 1) {
        const existing = items.value.find((item) => item.productId === product.id)

        if (existing) {
            existing.quantity += quantity
            items.value = [...items.value]
        } else {
            items.value = [...items.value, toCartItem(product, quantity)]
        }

        persist()
    }

    /** @deprecated используйте addProduct */
    function addSet(set: MenuSet, quantity = 1) {
        addProduct(set, quantity)
    }

    function setQuantity(productId: string, quantity: number) {
        if (quantity <= 0) {
            removeItem(productId)
            return
        }

        items.value = items.value.map((item) =>
            item.productId === productId ? { ...item, quantity } : item,
        )
        persist()
    }

    function increment(productId: string) {
        const item = items.value.find((entry) => entry.productId === productId)
        if (!item) {
            return
        }
        setQuantity(productId, item.quantity + 1)
    }

    function decrement(productId: string) {
        const item = items.value.find((entry) => entry.productId === productId)
        if (!item) {
            return
        }
        setQuantity(productId, item.quantity - 1)
    }

    function removeItem(productId: string) {
        items.value = items.value.filter((item) => item.productId !== productId)
        persist()
    }

    function clear() {
        items.value = []
        persist()
    }

    return {
        items,
        totalCount,
        totalPrice,
        isEmpty,
        hydrate,
        addProduct,
        addSet,
        setQuantity,
        increment,
        decrement,
        removeItem,
        clear,
    }
}
