<script setup lang="ts">
import { MenuProductCard, type MenuProduct } from '@entities/menu'
import { useCartStore } from '@entities/cart'
import { UiButton, useToast } from '@shared'

const props = defineProps<{
    product: MenuProduct
}>()

const toast = useToast()
const cartStore = useCartStore()

function onAdd() {
    cartStore.addProduct(props.product)
    toast.add({
        title: 'Добавлено в корзину',
        description: props.product.title,
        color: 'success',
        icon: 'i-lucide-shopping-bag',
    })
}
</script>

<template>
    <MenuProductCard :item="product">
        <template #action>
            <UiButton icon="i-lucide-plus" color="primary" size="sm" @click="onAdd">
                В корзину
            </UiButton>
        </template>
    </MenuProductCard>
</template>
