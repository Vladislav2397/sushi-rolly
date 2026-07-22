import { describe, expect, it } from 'vitest'
import { ManageCartLineItem } from '@features/manage-cart-item'
import { useCartStore, type CartItem } from '@entities/cart'
import { mountWithPinia } from '@shared/lib/test-utils'

const item: CartItem = {
    productId: 'roll-1',
    category: 'roll',
    title: 'Филадельфия',
    price: 420,
    quantity: 2,
}

describe('ManageCartLineItem', () => {
    it('увеличивает, уменьшает и удаляет позицию', async () => {
        const wrapper = mountWithPinia(ManageCartLineItem, {
            props: { item }
        })

        const cart = useCartStore()
        cart.items = [{ ...item }]

        const buttons = wrapper.findAll('button')
        const decrement = buttons[0]
        const increment = buttons[1]
        const remove = buttons.find((btn) => btn.text().includes('Удалить'))

        await increment!.trigger('click')
        expect(cart.items[0]?.quantity).toBe(3)

        await decrement!.trigger('click')
        expect(cart.items[0]?.quantity).toBe(2)

        await remove!.trigger('click')
        expect(cart.items).toHaveLength(0)
    })
})
