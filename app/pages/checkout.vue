<script setup lang="ts">
definePageMeta({
    middleware: 'auth',
})

useSeoMeta({
    title: 'Оформление заказа — Sushi Rolly',
})

const { isEmpty } = useCartStore()

watchEffect(() => {
    if (isEmpty.value) {
        navigateTo('/cart')
    }
})
</script>

<template>
    <div class="mx-auto max-w-2xl space-y-6">
        <div>
            <h1 class="font-display text-3xl font-semibold text-ink-950">Оформление</h1>
            <p class="mt-1 text-sm text-ink-500">Самовывоз или доставка по адресу</p>
        </div>

        <CheckoutForm />
    </div>
</template>
