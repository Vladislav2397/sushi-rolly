<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { api } from '@shared/api'
import { formatDateTime, formatPhone, formatPrice, UiBadge, UiSkeleton } from '@shared'
import {
    ORDER_FULFILLMENT_LABEL,
    ORDER_STATUS_LABEL,
    type Order,
    type OrderStatus,
} from '@entities/order'

const STATUS_OPTIONS: OrderStatus[] = ['new', 'cooking', 'on_the_way', 'ready', 'done']

const orders = ref<Order[]>([])
const pending = ref(true)
const error = ref('')
const savingId = ref<string | null>(null)

async function load() {
    pending.value = true
    error.value = ''
    try {
        const data = await api<{ orders: Order[] }>('/api/admin/orders')
        orders.value = data.orders
    } catch {
        error.value = 'Не удалось загрузить заказы'
    } finally {
        pending.value = false
    }
}

async function updateStatus(order: Order, status: OrderStatus) {
    if (order.status === status) {
        return
    }

    savingId.value = order.id
    try {
        const data = await api<{ order: Order }>(`/api/admin/orders/${order.id}`, {
            method: 'PATCH',
            body: { status },
        })
        orders.value = orders.value.map((item) => (item.id === order.id ? data.order : item))
    } catch {
        error.value = 'Не удалось обновить статус'
    } finally {
        savingId.value = null
    }
}

onMounted(() => {
    void load()
})
</script>

<template>
    <div class="space-y-6">
        <div>
            <h1 class="font-display text-3xl font-semibold text-ink-950">Заказы</h1>
            <p class="mt-1 text-sm text-ink-500">Все заказы ресторана</p>
        </div>

        <p v-if="error" class="text-sm text-brand-600">{{ error }}</p>

        <div v-if="pending" class="space-y-3">
            <UiSkeleton v-for="n in 4" :key="n" class="h-28 rounded-2xl" />
        </div>

        <div v-else-if="!orders.length" class="rounded-2xl bg-white px-6 py-12 text-center ring-1 ring-ink-200/80">
            Заказов пока нет
        </div>

        <div v-else class="space-y-3">
            <article
                v-for="order in orders"
                :key="order.id"
                class="rounded-2xl bg-white p-5 ring-1 ring-ink-200/80"
            >
                <div class="flex flex-wrap items-start justify-between gap-3">
                    <div>
                        <p class="font-display text-lg font-semibold">
                            #{{ order.id.slice(-6).toUpperCase() }}
                        </p>
                        <p class="text-sm text-ink-500">
                            {{ formatDateTime(order.createdAt) }} · {{ formatPhone(order.phone) }}
                        </p>
                    </div>

                    <div class="flex flex-wrap items-center gap-2">
                        <UiBadge color="neutral" variant="subtle">
                            {{ ORDER_FULFILLMENT_LABEL[order.fulfillment] }}
                        </UiBadge>
                        <select
                            class="rounded-xl border border-ink-200 bg-white px-3 py-2 text-sm outline-none focus:border-brand-400"
                            :value="order.status"
                            :disabled="savingId === order.id"
                            @change="updateStatus(order, ($event.target as HTMLSelectElement).value as OrderStatus)"
                        >
                            <option v-for="status in STATUS_OPTIONS" :key="status" :value="status">
                                {{ ORDER_STATUS_LABEL[status] }}
                            </option>
                        </select>
                    </div>
                </div>

                <ul class="mt-4 space-y-1 border-t border-ink-100 pt-3 text-sm">
                    <li
                        v-for="item in order.items"
                        :key="`${order.id}-${item.productId}`"
                        class="flex justify-between gap-3"
                    >
                        <span class="text-ink-700">
                            {{ item.title }}
                            <span class="text-ink-400">× {{ item.quantity }}</span>
                        </span>
                        <span class="font-medium">{{ formatPrice(item.price * item.quantity) }}</span>
                    </li>
                </ul>

                <p class="mt-3 font-display text-lg font-semibold">
                    Итого: {{ formatPrice(order.total) }}
                </p>
            </article>
        </div>
    </div>
</template>
