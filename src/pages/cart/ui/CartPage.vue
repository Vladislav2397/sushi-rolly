<script setup lang="ts">
import { CartPanel } from '@widgets/cart-panel'
</script>

<template>
    <div class="space-y-6">
        <div>
            <h1 class="font-display text-3xl font-semibold text-ink-950">Корзина</h1>
            <p class="mt-1 text-sm text-ink-500">Проверьте состав перед оформлением</p>
        </div>

        <CartPanel />
    </div>
</template>
