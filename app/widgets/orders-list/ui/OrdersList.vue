<script setup lang="ts">
import { useUserStore } from '@entities/user'
import { OrderCard, useOrderStore } from '@entities/order'

const { user } = useUserStore()
const { getOrdersByUser, fetchOrders, ordersLoaded } = useOrderStore()

const pending = ref(!ordersLoaded.value)

onMounted(async () => {
    if (!ordersLoaded.value) {
        try {
            await fetchOrders()
        } finally {
            pending.value = false
        }
    } else {
        pending.value = false
    }
})

const userOrders = computed(() => {
    if (!user.value) {
        return []
    }
    return getOrdersByUser(user.value.id).value
})
</script>

<template>
    <div v-if="pending" class="space-y-4">
        <USkeleton v-for="n in 2" :key="n" class="h-48 rounded-3xl" />
    </div>

    <div v-else-if="!userOrders.length" class="rounded-3xl bg-white px-6 py-16 text-center ring-1 ring-ink-200/80">
        <UIcon name="i-lucide-receipt" class="mx-auto size-10 text-ink-300" />
        <h2 class="mt-4 font-display text-2xl font-semibold">Пока нет заказов</h2>
        <p class="mt-2 text-sm text-ink-500">Оформите первый заказ из меню</p>
        <UButton to="/" class="mt-6" size="lg">Выбрать сет</UButton>
    </div>

    <div v-else class="space-y-4">
        <OrderCard
            v-for="order in userOrders"
            :key="order.id"
            :order="order"
        />
    </div>
</template>
