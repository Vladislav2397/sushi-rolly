<script setup lang="ts">
import { useUserStore } from '@entities/user'
import { AuthByPhoneForm } from '@features/auth-by-phone'

definePageMeta({
    layout: 'default',
})

useSeoMeta({
    title: 'Вход — Sushi Rolly',
})

const { isAuthenticated } = useUserStore()
const route = useRoute()

watchEffect(() => {
    if (isAuthenticated.value) {
        const redirect = typeof route.query.redirect === 'string' ? route.query.redirect : '/'
        navigateTo(redirect)
    }
})
</script>

<template>
    <div class="flex min-h-[70vh] items-center justify-center py-4">
        <AuthByPhoneForm />
    </div>
</template>
