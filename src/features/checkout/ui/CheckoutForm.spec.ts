import { describe, expect, it, vi } from 'vitest'
import { CheckoutForm } from '@features/checkout'
import { useCartStore } from '@entities/cart'
import { useUserStore } from '@entities/user'
import { useOrderStore } from '@entities/order'
import { useToastStore } from '@shared/ui/useToast'
import { mountWithPinia } from '@shared/lib/test-utils'
import type { Order } from '@entities/order'

const sampleOrder: Order = {
    id: 'ord_demo_abc123',
    userId: 'user-1',
    phone: '79991234567',
    items: [],
    fulfillment: 'pickup',
    address: null,
    comment: '',
    subtotal: 1290,
    deliveryFee: 0,
    total: 1290,
    status: 'new',
    createdAt: '2026-07-22T10:00:00.000Z',
}

describe('CheckoutForm', () => {
    it('эмитит need-auth если пользователь не авторизован', async () => {
        const wrapper = mountWithPinia(CheckoutForm)
        const cart = useCartStore()
        cart.items = [
            {
                productId: 'set-1',
                category: 'set',
                title: 'Сет',
                price: 1290,
                quantity: 1,
                number: 1,
            },
        ]

        await wrapper.get('form').trigger('submit')

        expect(wrapper.emitted('need-auth')).toHaveLength(1)
    })

    it('показывает ошибку при пустой корзине', async () => {
        const wrapper = mountWithPinia(CheckoutForm)
        const user = useUserStore()
        user.user = { id: 'user-1', phone: '79991234567', createdAt: '2026-01-01' }

        await wrapper.get('form').trigger('submit')

        expect(wrapper.text()).toContain('Корзина пуста')
    })

    it('создаёт заказ, очищает корзину и эмитит success', async () => {
        const wrapper = mountWithPinia(CheckoutForm)
        const user = useUserStore()
        const cart = useCartStore()
        const orders = useOrderStore()
        const toast = useToastStore()

        user.user = { id: 'user-1', phone: '79991234567', createdAt: '2026-01-01' }
        cart.items = [
            {
                productId: 'set-1',
                category: 'set',
                title: 'Сет',
                price: 1290,
                quantity: 1,
                number: 1,
            },
        ]

        vi.spyOn(orders, 'createOrder').mockResolvedValue(sampleOrder)

        await wrapper.get('form').trigger('submit')
        await wrapper.vm.$nextTick()

        expect(orders.createOrder).toHaveBeenCalled()
        expect(cart.items).toHaveLength(0)
        expect(wrapper.emitted('success')).toHaveLength(1)
        expect(toast.items[0]?.title).toBe('Заказ оформлен')
    })

    it('требует адрес при доставке', async () => {
        const wrapper = mountWithPinia(CheckoutForm)
        const user = useUserStore()
        const cart = useCartStore()

        user.user = { id: 'user-1', phone: '79991234567', createdAt: '2026-01-01' }
        cart.items = [
            {
                productId: 'set-1',
                category: 'set',
                title: 'Сет',
                price: 1290,
                quantity: 1,
                number: 1,
            },
        ]

        const deliveryOption = wrapper
            .findAll('[role="radio"]')
            .find((el) => el.text().includes('Доставка'))
        await deliveryOption!.trigger('click')
        await wrapper.vm.$nextTick()

        await wrapper.get('form').trigger('submit')
        await wrapper.vm.$nextTick()

        expect(wrapper.text()).toContain('Укажите адрес доставки')
    })
})
