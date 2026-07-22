<script setup lang="ts">
import type { MenuSet } from '../model/types'
import { formatPrice, UiBadge, UiButton } from '@shared'

defineProps<{
    item: MenuSet
}>()

defineEmits<{
    add: []
}>()
</script>

<template>
    <article
        class="group relative flex h-full flex-col overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-ink-200/70 transition duration-300 hover:-translate-y-1 hover:shadow-lg"
    >
        <div
            class="relative flex h-44 items-end overflow-hidden px-5 pt-6 pb-5 text-white"
            :style="{
                background: `linear-gradient(145deg, ${item.accent} 0%, color-mix(in oklab, ${item.accent} 55%, #1a2024) 100%)`,
            }"
        >
            <div
                class="pointer-events-none absolute -top-8 -right-6 font-display text-[7.5rem] leading-none font-bold opacity-20 transition duration-500 group-hover:scale-110"
            >
                {{ item.number }}
            </div>
            <div class="relative z-10">
                <p class="text-xs tracking-[0.2em] uppercase opacity-80">Сет №{{ item.number }}</p>
                <h3 class="mt-1 font-display text-2xl font-semibold">{{ item.title }}</h3>
            </div>
        </div>

        <div class="flex flex-1 flex-col gap-4 p-5">
            <p class="text-sm leading-relaxed text-ink-600">
                {{ item.description }}
            </p>

            <div class="flex flex-wrap gap-2">
                <UiBadge
                    v-for="tag in item.tags"
                    :key="tag"
                    color="neutral"
                    variant="subtle"
                    size="sm"
                >
                    {{ tag }}
                </UiBadge>
            </div>

            <div class="mt-auto flex items-end justify-between gap-3 border-t border-ink-100 pt-4">
                <div>
                    <p class="font-display text-xl font-semibold text-ink-950">
                        {{ formatPrice(item.price) }}
                    </p>
                    <p class="text-xs text-ink-500">{{ item.pieces }} шт · {{ item.weight }} г</p>
                </div>

                <UiButton icon="i-lucide-plus" color="primary" @click="$emit('add')">
                    В корзину
                </UiButton>
            </div>
        </div>
    </article>
</template>
