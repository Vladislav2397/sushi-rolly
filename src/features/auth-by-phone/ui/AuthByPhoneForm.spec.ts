import { describe, expect, it, vi } from 'vitest'
import { AuthByPhoneForm } from '@features/auth-by-phone'
import { useUserStore } from '@entities/user'
import { useToastStore } from '@shared/ui/useToast'
import { mountWithPinia } from '@shared/lib/test-utils'

describe('AuthByPhoneForm', () => {
    it('показывает ошибку при невалидном телефоне', async () => {
        const wrapper = mountWithPinia(AuthByPhoneForm)

        await wrapper.get('input[type="tel"]').setValue('123')
        await wrapper.get('form').trigger('submit')

        expect(wrapper.text()).toContain('Введите номер в формате +7XXXXXXXXXX')
    })

    it('запрашивает код и переходит на шаг ввода SMS', async () => {
        const wrapper = mountWithPinia(AuthByPhoneForm)
        const userStore = useUserStore()
        const toast = useToastStore()

        vi.spyOn(userStore, 'requestCode').mockResolvedValue({ ok: true })

        await wrapper.get('input[type="tel"]').setValue('+79991234567')
        await wrapper.get('form').trigger('submit')
        await wrapper.vm.$nextTick()

        expect(userStore.requestCode).toHaveBeenCalledWith('+79991234567')
        expect(wrapper.text()).toContain('Код отправлен на')
        expect(toast.items[0]?.title).toBe('Код отправлен')
    })

    it('эмитит success после успешной проверки кода', async () => {
        const wrapper = mountWithPinia(AuthByPhoneForm)
        const userStore = useUserStore()
        const toast = useToastStore()

        userStore.pendingPhone = '79991234567'
        await wrapper.vm.$nextTick()

        vi.spyOn(userStore, 'verifyCode').mockResolvedValue({ ok: true })

        const pinInputs = wrapper.findAll('input[inputmode="numeric"]')
        for (const [index, digit] of ['1', '2', '3', '4'].entries()) {
            await pinInputs[index]!.setValue(digit)
        }

        await wrapper.get('form').trigger('submit')
        await wrapper.vm.$nextTick()

        expect(userStore.verifyCode).toHaveBeenCalledWith('1234')
        expect(wrapper.emitted('success')).toHaveLength(1)
        expect(toast.items[0]?.title).toBe('Вы вошли')
    })
})
