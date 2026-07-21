<script setup lang="ts">
const { user } = useUserStore()
const { getOrdersByUser } = useOrderStore()

const userOrders = computed(() => {
    if (!user.value) {
        return []
    }
    return getOrdersByUser(user.value.id).value
})
</script>

<template>
    <div v-if="!userOrders.length" class="rounded-3xl bg-white px-6 py-16 text-center ring-1 ring-ink-200/80">
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
