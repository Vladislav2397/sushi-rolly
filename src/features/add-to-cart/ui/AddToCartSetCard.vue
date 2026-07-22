<script setup lang="ts">
import { MenuSetCard, type MenuSet } from '@entities/menu'
import { useCartStore } from '@entities/cart'
import { UiButton, useToast } from '@shared'

const props = defineProps<{
    set: MenuSet
}>()

const toast = useToast()
const cartStore = useCartStore()

function onAdd() {
    cartStore.addProduct(props.set)
    toast.add({
        title: 'Добавлено в корзину',
        description: props.set.title,
        color: 'success',
        icon: 'i-lucide-shopping-bag',
    })
}
</script>

<template>
    <MenuSetCard :item="set">
        <template #action>
            <UiButton icon="i-lucide-plus" color="primary" @click="onAdd">В корзину</UiButton>
        </template>
    </MenuSetCard>
</template>
