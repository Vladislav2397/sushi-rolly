<script setup lang="ts">
import { watchEffect } from 'vue'
import { storeToRefs } from 'pinia'
import { navigate } from 'vike/client/router'
import { useCartStore } from '@entities/cart'
import { CheckoutForm } from '@features/checkout'

const cartStore = useCartStore()
const { isEmpty } = storeToRefs(cartStore)

watchEffect(() => {
    if (isEmpty.value) {
        void navigate('/cart')
    }
})

function onNeedAuth() {
    return navigate('/auth?redirect=/checkout')
}

function onSuccess() {
    return navigate('/orders')
}
</script>

<template>
    <div class="mx-auto max-w-2xl space-y-6">
        <div>
            <h1 class="font-display text-3xl font-semibold text-ink-950">Оформление</h1>
            <p class="mt-1 text-sm text-ink-500">Самовывоз или доставка по адресу</p>
        </div>

        <CheckoutForm
            @need-auth="onNeedAuth"
            @success="onSuccess"
        />
    </div>
</template>
