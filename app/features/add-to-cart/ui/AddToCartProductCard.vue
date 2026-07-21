<script setup lang="ts">
import { MenuProductCard, type MenuProduct } from '@entities/menu'
import { useCartStore } from '@entities/cart'

const props = defineProps<{
    product: MenuProduct
}>()

const toast = useToast()
const { addProduct } = useCartStore()

function onAdd() {
    addProduct(props.product)
    toast.add({
        title: 'Добавлено в корзину',
        description: props.product.title,
        color: 'success',
        icon: 'i-lucide-shopping-bag',
    })
}
</script>

<template>
    <MenuProductCard :item="product" @add="onAdd" />
</template>
