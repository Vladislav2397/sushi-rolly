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

function redirectAfterAuth() {
    const redirect = typeof route.query.redirect === 'string' ? route.query.redirect : '/'
    return navigateTo(redirect)
}

watchEffect(() => {
    if (isAuthenticated.value) {
        redirectAfterAuth()
    }
})
</script>

<template>
    <div class="flex min-h-[70vh] items-center justify-center py-4">
        <AuthByPhoneForm @success="redirectAfterAuth" />
    </div>
</template>
