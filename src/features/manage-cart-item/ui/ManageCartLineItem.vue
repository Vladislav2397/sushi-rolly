<script setup lang="ts">
import { CartLineItem, useCartStore, type CartItem } from '@entities/cart'
import { UiButton } from '@shared'

const props = defineProps<{
    item: CartItem
}>()

const cartStore = useCartStore()
</script>

<template>
    <CartLineItem :item="item">
        <template #decrement>
            <UiButton
                icon="i-lucide-minus"
                color="neutral"
                variant="soft"
                size="sm"
                square
                @click="cartStore.decrement(props.item.productId)"
            />
        </template>
        <template #increment>
            <UiButton
                icon="i-lucide-plus"
                color="neutral"
                variant="soft"
                size="sm"
                square
                @click="cartStore.increment(props.item.productId)"
            />
        </template>
        <template #remove>
            <UiButton
                color="neutral"
                variant="link"
                size="xs"
                class="px-0"
                @click="cartStore.removeItem(props.item.productId)"
            >
                Удалить
            </UiButton>
        </template>
    </CartLineItem>
</template>
