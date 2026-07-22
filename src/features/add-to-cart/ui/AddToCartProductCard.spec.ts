import { describe, expect, it } from 'vitest'
import { AddToCartProductCard } from '@features/add-to-cart'
import { useCartStore } from '@entities/cart'
import { useToastStore } from '@shared/ui/useToast'
import type { MenuProduct } from '@entities/menu'
import { mountWithPinia } from '@shared/lib/test-utils'

const product: MenuProduct = {
    id: 'roll-1',
    category: 'roll',
    title: 'Филадельфия',
    description: 'Лосось, сыр, огурец',
    price: 420,
    pieces: 8,
    weight: 240,
    tags: ['лосось'],
}

describe('AddToCartProductCard', () => {
    it('добавляет продукт в корзину и показывает toast', async () => {
        const wrapper = mountWithPinia(AddToCartProductCard, {
            props: { product },
        })

        const cart = useCartStore()
        const toast = useToastStore()

        await wrapper.get('button').trigger('click')

        expect(cart.items).toHaveLength(1)
        expect(cart.items[0]).toMatchObject({
            productId: 'roll-1',
            title: 'Филадельфия',
            quantity: 1,
        })
        expect(toast.items[0]).toMatchObject({
            title: 'Добавлено в корзину',
            description: 'Филадельфия',
        })
    })
})
