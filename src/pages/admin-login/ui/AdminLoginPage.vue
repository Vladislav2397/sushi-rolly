<script setup lang="ts">
import { ref } from 'vue'
import { useAdminStore } from '@entities/admin'
import { UiButton, UiFormField, UiInput, useToast } from '@shared'

const adminStore = useAdminStore()
const toast = useToast()

const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')

async function submit() {
    error.value = ''
    loading.value = true

    try {
        await adminStore.login(email.value.trim(), password.value)
        toast.add({
            title: 'Вход выполнен',
            color: 'success',
            icon: 'i-lucide-check',
        })
        window.location.href = '/admin/orders'
    } catch {
        error.value = 'Неверный email или пароль'
    } finally {
        loading.value = false
    }
}
</script>

<template>
    <div class="flex min-h-dvh items-center justify-center px-4 py-10">
        <form
            class="w-full max-w-md rounded-3xl bg-white p-6 shadow-sm ring-1 ring-ink-200/80 sm:p-8"
            @submit.prevent="submit"
        >
            <p class="text-xs tracking-[0.2em] text-brand-600 uppercase">Админка</p>
            <h1 class="mt-2 font-display text-3xl font-semibold text-ink-950">Вход</h1>
            <p class="mt-2 text-sm text-ink-500">Войдите по email и паролю</p>

            <div class="mt-6 space-y-4">
                <UiFormField label="Email" name="email" :error="error || undefined">
                    <UiInput
                        v-model="email"
                        type="email"
                        size="lg"
                        icon="i-lucide-mail"
                        placeholder="admin@sushi-rolly.local"
                        autocomplete="username"
                    />
                </UiFormField>

                <UiFormField label="Пароль" name="password">
                    <UiInput
                        v-model="password"
                        type="password"
                        size="lg"
                        icon="i-lucide-lock"
                        placeholder="••••••••"
                        autocomplete="current-password"
                    />
                </UiFormField>

                <UiButton type="submit" size="xl" block :loading="loading">
                    Войти
                </UiButton>
            </div>
        </form>
    </div>
</template>
