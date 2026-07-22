import { describe, expect, it } from 'vitest'
import { AddToCartSetCard } from '@features/add-to-cart'
import { useCartStore } from '@entities/cart'
import { useToastStore } from '@shared/ui/useToast'
import type { MenuSet } from '@entities/menu'
import { mountWithPinia } from '@shared/lib/test-utils'

const set: MenuSet = {
    id: 'set-1',
    category: 'set',
    number: 1,
    title: 'Сет «Классика»',
    description: 'Филадельфия и Калифорния',
    pieces: 32,
    weight: 980,
    price: 1290,
    tags: ['хит'],
    accent: '#f24d2c',
}

describe('AddToCartSetCard', () => {
    it('добавляет сет в корзину и показывает toast', async () => {
        const wrapper = mountWithPinia(AddToCartSetCard, {
            props: { set },
        })

        const cart = useCartStore()
        const toast = useToastStore()

        await wrapper.get('button').trigger('click')

        expect(cart.items).toHaveLength(1)
        expect(cart.items[0]).toMatchObject({
            productId: 'set-1',
            title: 'Сет «Классика»',
            quantity: 1,
        })
        expect(toast.items[0]).toMatchObject({
            title: 'Добавлено в корзину',
            description: 'Сет «Классика»',
        })
    })
})
