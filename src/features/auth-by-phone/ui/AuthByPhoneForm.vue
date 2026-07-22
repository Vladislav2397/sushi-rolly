<script setup lang="ts">
import { ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useUserStore } from '@entities/user'
import { formatPhone, isValidPhone, UiButton, UiFormField, UiInput, UiPinInput, useToast } from '@shared'

const emit = defineEmits<{
    success: []
}>()

const toast = useToast()
const userStore = useUserStore()
const { pendingPhone } = storeToRefs(userStore)

const step = ref<'phone' | 'code'>(pendingPhone.value ? 'code' : 'phone')
const phone = ref('')
const codeDigits = ref<string[]>([])
const loading = ref(false)
const error = ref('')

watch(pendingPhone, (value) => {
    if (value) {
        step.value = 'code'
    }
})

async function submitPhone() {
    error.value = ''

    if (!isValidPhone(phone.value)) {
        error.value = 'Введите номер в формате +7XXXXXXXXXX'
        return
    }

    loading.value = true
    try {
        await userStore.requestCode(phone.value)
        step.value = 'code'
        toast.add({
            title: 'Код отправлен',
            description: 'Для демо введите код 1234',
            color: 'success',
            icon: 'i-lucide-message-circle',
        })
    } catch {
        error.value = 'Не удалось отправить код'
    } finally {
        loading.value = false
    }
}

async function submitCode() {
    error.value = ''
    const code = codeDigits.value.join('')

    if (code.length !== 4) {
        error.value = 'Введите 4-значный код'
        return
    }

    loading.value = true
    const result = await userStore.verifyCode(code)
    loading.value = false

    if (!result.ok) {
        error.value = result.error
        return
    }

    toast.add({
        title: 'Вы вошли',
        description: 'Можно оформлять заказы',
        color: 'success',
        icon: 'i-lucide-check',
    })

    emit('success')
}

function backToPhone() {
    step.value = 'phone'
    error.value = ''
    codeDigits.value = []
}
</script>

<template>
    <div class="mx-auto w-full max-w-md rounded-3xl bg-white p-6 shadow-sm ring-1 ring-ink-200/80 sm:p-8">
        <div class="mb-6">
            <p class="text-xs tracking-[0.2em] text-brand-600 uppercase">Вход</p>
            <h1 class="mt-2 font-display text-3xl font-semibold text-ink-950">
                По номеру телефона
            </h1>
            <p class="mt-2 text-sm text-ink-500">
                Код придёт в SMS. В демо-режиме используйте
                <span class="font-semibold text-ink-800">1234</span>.
            </p>
        </div>

        <form
            v-if="step === 'phone'"
            class="space-y-4"
            @submit.prevent="submitPhone"
        >
            <UiFormField label="Телефон" name="phone" :error="error || undefined">
                <UiInput
                    v-model="phone"
                    type="tel"
                    size="xl"
                    icon="i-lucide-phone"
                    placeholder="+7 (999) 123-45-67"
                    autocomplete="tel"
                    class="w-full"
                />
            </UiFormField>

            <UiButton type="submit" size="xl" block :loading="loading">
                Получить код
            </UiButton>
        </form>

        <form
            v-else
            class="space-y-5"
            @submit.prevent="submitCode"
        >
            <p class="text-sm text-ink-600">
                Код отправлен на
                <span class="font-medium text-ink-950">
                    {{ formatPhone(pendingPhone || phone) }}
                </span>
            </p>

            <UiFormField label="Код из SMS" name="code" :error="error || undefined">
                <UiPinInput v-model="codeDigits" :length="4" size="xl" placeholder="○" />
            </UiFormField>

            <UiButton type="submit" size="xl" block :loading="loading">
                Войти
            </UiButton>

            <UiButton color="neutral" variant="ghost" block @click="backToPhone">
                Изменить номер
            </UiButton>
        </form>
    </div>
</template>
