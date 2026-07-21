<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { api } from '@shared/api'
import { formatDateTime, formatPhone, UiSkeleton } from '@shared'

interface AdminUser {
    id: string
    phone: string
    createdAt: string
}

const users = ref<AdminUser[]>([])
const pending = ref(true)
const error = ref('')

async function load() {
    pending.value = true
    error.value = ''
    try {
        const data = await api<{ users: AdminUser[] }>('/api/admin/users')
        users.value = data.users
    } catch {
        error.value = 'Не удалось загрузить пользователей'
    } finally {
        pending.value = false
    }
}

onMounted(() => {
    void load()
})
</script>

<template>
    <div class="space-y-6">
        <div>
            <h1 class="font-display text-3xl font-semibold text-ink-950">Пользователи</h1>
            <p class="mt-1 text-sm text-ink-500">Клиенты, зарегистрированные по телефону</p>
        </div>

        <p v-if="error" class="text-sm text-brand-600">{{ error }}</p>

        <div v-if="pending" class="space-y-3">
            <UiSkeleton v-for="n in 5" :key="n" class="h-12 rounded-2xl" />
        </div>

        <div v-else class="overflow-hidden rounded-2xl bg-white ring-1 ring-ink-200/80">
            <table class="w-full text-left text-sm">
                <thead class="border-b border-ink-100 bg-ink-50 text-ink-500">
                    <tr>
                        <th class="px-4 py-3 font-medium">Телефон</th>
                        <th class="px-4 py-3 font-medium">ID</th>
                        <th class="px-4 py-3 font-medium">Регистрация</th>
                    </tr>
                </thead>
                <tbody>
                    <tr
                        v-for="user in users"
                        :key="user.id"
                        class="border-b border-ink-100 last:border-0"
                    >
                        <td class="px-4 py-3 font-medium text-ink-950">
                            {{ formatPhone(user.phone) }}
                        </td>
                        <td class="px-4 py-3 font-mono text-xs text-ink-500">{{ user.id }}</td>
                        <td class="px-4 py-3 text-ink-600">{{ formatDateTime(user.createdAt) }}</td>
                    </tr>
                    <tr v-if="!users.length">
                        <td colspan="3" class="px-4 py-10 text-center text-ink-500">
                            Пользователей пока нет
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>
