import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { api } from '@shared/api'
import type { Admin } from './types'

export const useAdminStore = defineStore('admin', () => {
    const admin = ref<Admin | null>(null)
    const authReady = ref(false)

    const isAuthenticated = computed(() => Boolean(admin.value))

    async function fetchMe() {
        try {
            const data = await api<{ admin: Admin | null }>('/api/admin/auth/me')
            admin.value = data.admin
        } catch {
            admin.value = null
        } finally {
            authReady.value = true
        }
    }

    async function login(email: string, password: string) {
        const data = await api<{ admin: Admin }>('/api/admin/auth/login', {
            method: 'POST',
            body: { email, password },
        })
        admin.value = data.admin
        authReady.value = true
        return data.admin
    }

    async function logout() {
        await api('/api/admin/auth/logout', { method: 'POST' })
        admin.value = null
    }

    return {
        admin,
        authReady,
        isAuthenticated,
        fetchMe,
        login,
        logout,
    }
})
