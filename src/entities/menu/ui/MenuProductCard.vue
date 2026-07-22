<script setup lang="ts">
import type { MenuProduct } from '../model/types'
import { MENU_CATEGORY_ACCENT, MENU_CATEGORY_ICON, MENU_CATEGORY_LABEL } from '../model/category'
import { formatPrice, UiBadge, UiButton, UiIcon } from '@shared'

defineProps<{
    item: MenuProduct
}>()

defineEmits<{
    add: []
}>()

function metaLine(item: MenuProduct): string {
    const parts: string[] = []
    if (item.pieces) {
        parts.push(`${item.pieces} шт`)
    }
    if (item.weight) {
        parts.push(`${item.weight} г`)
    }
    if (item.volume) {
        parts.push(`${item.volume} мл`)
    }
    return parts.join(' · ')
}
</script>

<template>
    <article
        class="group flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-ink-200/70 transition duration-300 hover:-translate-y-0.5 hover:shadow-md"
    >
        <div
            class="flex items-center gap-3 px-4 py-3 text-white"
            :style="{
                background: `linear-gradient(135deg, ${MENU_CATEGORY_ACCENT[item.category]} 0%, color-mix(in oklab, ${MENU_CATEGORY_ACCENT[item.category]} 60%, #1a2024) 100%)`,
            }"
        >
            <div class="flex size-9 items-center justify-center rounded-xl bg-white/15">
                <UiIcon :name="MENU_CATEGORY_ICON[item.category]" class="size-4" />
            </div>
            <p class="text-xs tracking-[0.15em] uppercase opacity-90">
                {{ MENU_CATEGORY_LABEL[item.category] }}
            </p>
        </div>

        <div class="flex flex-1 flex-col gap-3 p-4">
            <div>
                <h3 class="font-display text-lg font-semibold text-ink-950">{{ item.title }}</h3>
                <p class="mt-1 text-sm leading-relaxed text-ink-600">{{ item.description }}</p>
            </div>

            <div v-if="item.tags.length" class="flex flex-wrap gap-1.5">
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

            <div class="mt-auto flex items-end justify-between gap-3 border-t border-ink-100 pt-3">
                <div>
                    <p class="font-display text-lg font-semibold text-ink-950">
                        {{ formatPrice(item.price) }}
                    </p>
                    <p v-if="metaLine(item)" class="text-xs text-ink-500">{{ metaLine(item) }}</p>
                </div>

                <UiButton
                    icon="i-lucide-plus"
                    color="primary"
                    size="sm"
                    @click="$emit('add')"
                >
                    В корзину
                </UiButton>
            </div>
        </div>
    </article>
</template>
