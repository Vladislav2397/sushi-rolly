import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import type { User } from './types'
import { api, type ApiUserResponse } from '@shared/api'
import { normalizePhone } from '@shared/lib/format'

export const useUserStore = defineStore('user', () => {
    const user = ref<User | null>(null)
    const pendingPhone = ref<string | null>(null)
    const authReady = ref(false)

    const isAuthenticated = computed(() => Boolean(user.value))

    async function fetchMe() {
        try {
            const data = await api<ApiUserResponse>('/api/auth/me')
            user.value = data.user
        } catch {
            user.value = null
        } finally {
            authReady.value = true
        }
    }

    async function requestCode(phone: string) {
        const normalized = normalizePhone(phone)
        await api('/api/auth/request-code', {
            method: 'POST',
            body: { phone: normalized },
        })
        pendingPhone.value = normalized
        return { ok: true as const }
    }

    async function verifyCode(code: string) {
        if (!pendingPhone.value) {
            return { ok: false as const, error: 'Сначала укажите номер телефона' }
        }

        try {
            const data = await api<{ user: User }>('/api/auth/verify-code', {
                method: 'POST',
                body: { phone: pendingPhone.value, code },
            })
            user.value = data.user
            pendingPhone.value = null
            return { ok: true as const }
        } catch {
            return { ok: false as const, error: 'Неверный код. Для демо используйте 1234' }
        }
    }

    async function logout() {
        await api('/api/auth/logout', { method: 'POST' })
        user.value = null
        pendingPhone.value = null
    }

    return {
        user,
        pendingPhone,
        authReady,
        isAuthenticated,
        fetchMe,
        requestCode,
        verifyCode,
        logout,
    }
})
