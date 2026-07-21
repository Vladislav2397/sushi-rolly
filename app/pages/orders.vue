<script setup lang="ts">
import { OrdersList } from '@widgets/orders-list'

definePageMeta({
    middleware: 'auth',
})

useSeoMeta({
    title: 'Мои заказы — Sushi Rolly',
})
</script>

<template>
    <div class="mx-auto max-w-3xl space-y-6">
        <div>
            <h1 class="font-display text-3xl font-semibold text-ink-950">Мои заказы</h1>
            <p class="mt-1 text-sm text-ink-500">История заказов по вашему номеру</p>
        </div>

        <OrdersList />
    </div>
</template>
