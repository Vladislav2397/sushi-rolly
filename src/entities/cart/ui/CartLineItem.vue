<script setup lang="ts">
import type { CartItem } from '../model/types'
import { MENU_CATEGORY_ICON, MENU_CATEGORY_LABEL } from '@entities/menu'
import { formatPrice, UiButton, UiIcon } from '@shared'

defineProps<{
    item: CartItem
}>()

defineEmits<{
    increment: []
    decrement: []
    remove: []
}>()
</script>

<template>
    <div class="flex items-center gap-4 rounded-2xl bg-white p-4 ring-1 ring-ink-200/80">
        <div
            class="flex size-14 shrink-0 items-center justify-center rounded-2xl font-display text-xl font-bold text-white"
            :class="item.category === 'set' ? 'bg-ink-950' : 'bg-brand-600'"
        >
            <span v-if="item.category === 'set' && item.number">{{ item.number }}</span>
            <UiIcon v-else :name="MENU_CATEGORY_ICON[item.category]" class="size-5" />
        </div>

        <div class="min-w-0 flex-1">
            <p class="truncate font-medium text-ink-950">{{ item.title }}</p>
            <p class="text-sm text-ink-500">
                {{ formatPrice(item.price) }}
                <span class="text-ink-400">· {{ MENU_CATEGORY_LABEL[item.category] }}</span>
            </p>
        </div>

        <div class="flex items-center gap-1">
            <UiButton
                icon="i-lucide-minus"
                color="neutral"
                variant="soft"
                size="sm"
                square
                @click="$emit('decrement')"
            />
            <span class="w-8 text-center text-sm font-semibold">{{ item.quantity }}</span>
            <UiButton
                icon="i-lucide-plus"
                color="neutral"
                variant="soft"
                size="sm"
                square
                @click="$emit('increment')"
            />
        </div>

        <div class="hidden w-24 text-right sm:block">
            <p class="font-semibold">{{ formatPrice(item.price * item.quantity) }}</p>
            <UiButton
                color="neutral"
                variant="link"
                size="xs"
                class="px-0"
                @click="$emit('remove')"
            >
                Удалить
            </UiButton>
        </div>
    </div>
</template>
