<script setup lang="ts">
import type { Order } from '../model/types'
import { ORDER_FULFILLMENT_LABEL, ORDER_STATUS_LABEL } from '../model/store'
import { MENU_CATEGORY_LABEL } from '@entities/menu'
import { formatDateTime, formatPrice, RESTAURANT, UiBadge } from '@shared'

defineProps<{
    order: Order
}>()

function itemLabel(item: Order['items'][number]): string {
    if (item.category === 'set' && item.number) {
        return `№${item.number} ${item.title}`
    }
    return `${MENU_CATEGORY_LABEL[item.category]} · ${item.title}`
}
</script>

<template>
    <article class="rounded-3xl bg-white p-5 ring-1 ring-ink-200/80">
        <div class="flex flex-wrap items-start justify-between gap-3">
            <div>
                <p class="font-display text-lg font-semibold text-ink-950">
                    Заказ {{ order.id.slice(-6).toUpperCase() }}
                </p>
                <p class="text-sm text-ink-500">{{ formatDateTime(order.createdAt) }}</p>
            </div>

            <div class="flex flex-wrap gap-2">
                <UiBadge color="primary" variant="subtle">
                    {{ ORDER_STATUS_LABEL[order.status] }}
                </UiBadge>
                <UiBadge color="neutral" variant="subtle">
                    {{ ORDER_FULFILLMENT_LABEL[order.fulfillment] }}
                </UiBadge>
            </div>
        </div>

        <ul class="mt-4 space-y-2 border-y border-ink-100 py-4">
            <li
                v-for="item in order.items"
                :key="item.productId"
                class="flex items-center justify-between gap-3 text-sm"
            >
                <span class="text-ink-700">
                    {{ itemLabel(item) }}
                    <span class="text-ink-400">× {{ item.quantity }}</span>
                </span>
                <span class="font-medium">{{ formatPrice(item.price * item.quantity) }}</span>
            </li>
        </ul>

        <div class="mt-4 space-y-1 text-sm">
            <p v-if="order.address" class="text-ink-600">
                Адрес: <span class="text-ink-950">{{ order.address }}</span>
            </p>
            <p v-else class="text-ink-600">
                Самовывоз: <span class="text-ink-950">{{ RESTAURANT.address }}</span>
            </p>
            <p v-if="order.comment" class="text-ink-600">
                Комментарий: <span class="text-ink-950">{{ order.comment }}</span>
            </p>
            <p class="pt-2 font-display text-lg font-semibold">
                Итого: {{ formatPrice(order.total) }}
            </p>
        </div>
    </article>
</template>
