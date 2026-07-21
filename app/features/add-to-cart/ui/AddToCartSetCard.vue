<script setup lang="ts">
import { MenuSetCard, type MenuSet } from '@entities/menu'
import { useCartStore } from '@entities/cart'

const props = defineProps<{
    set: MenuSet
}>()

const toast = useToast()
const { addProduct } = useCartStore()

function onAdd() {
    addProduct(props.set)
    toast.add({
        title: 'Добавлено в корзину',
        description: props.set.title,
        color: 'success',
        icon: 'i-lucide-shopping-bag',
    })
}
</script>

<template>
    <MenuSetCard :item="set" @add="onAdd" />
</template>
