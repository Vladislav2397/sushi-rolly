<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { CartLineItem, useCartStore } from '@entities/cart'
import { formatPrice, UiButton, UiIcon } from '@shared'

const cartStore = useCartStore()
const { items, totalPrice, isEmpty } = storeToRefs(cartStore)
</script>

<template>
    <div v-if="isEmpty" class="rounded-3xl bg-white px-6 py-16 text-center ring-1 ring-ink-200/80">
        <UiIcon name="i-lucide-shopping-bag" class="mx-auto size-10 text-ink-300" />
        <h2 class="mt-4 font-display text-2xl font-semibold">Корзина пуста</h2>
        <p class="mt-2 text-sm text-ink-500">Выберите позиции в меню и добавьте их сюда</p>
        <UiButton to="/" class="mt-6" size="lg">К меню</UiButton>
    </div>

    <div v-else class="space-y-4">
        <CartLineItem
            v-for="item in items"
            :key="item.productId"
            :item="item"
            @increment="cartStore.increment(item.productId)"
            @decrement="cartStore.decrement(item.productId)"
            @remove="cartStore.removeItem(item.productId)"
        />

        <div
            class="sticky bottom-4 flex flex-col gap-3 rounded-3xl bg-ink-950 p-5 text-white shadow-xl sm:flex-row sm:items-center sm:justify-between"
        >
            <div>
                <p class="text-sm text-white/70">Сумма заказа</p>
                <p class="font-display text-2xl font-semibold">{{ formatPrice(totalPrice) }}</p>
            </div>
            <UiButton
                to="/checkout"
                size="xl"
                color="primary"
                trailing-icon="i-lucide-arrow-right"
            >
                Оформить заказ
            </UiButton>
        </div>
    </div>
</template>
