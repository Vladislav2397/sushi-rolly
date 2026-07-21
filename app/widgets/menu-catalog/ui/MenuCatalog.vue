<script setup lang="ts">
import {
    MENU_CATEGORY_LABEL,
    MENU_DRINKS,
    MENU_ROLLS,
    MENU_SETS,
    MENU_SUSHI,
} from '@entities/menu'

const sections = [
    { id: 'sets', label: MENU_CATEGORY_LABEL.set, items: MENU_SETS, type: 'set' as const },
    { id: 'sushi', label: MENU_CATEGORY_LABEL.sushi, items: MENU_SUSHI, type: 'product' as const },
    { id: 'rolls', label: MENU_CATEGORY_LABEL.roll, items: MENU_ROLLS, type: 'product' as const },
    { id: 'drinks', label: MENU_CATEGORY_LABEL.drink, items: MENU_DRINKS, type: 'product' as const },
]
</script>

<template>
    <div class="space-y-10">
        <section
            v-for="section in sections"
            :id="section.id"
            :key="section.id"
            class="scroll-mt-28 space-y-4"
        >
            <div>
                <h3 class="font-display text-xl font-semibold text-ink-950 sm:text-2xl">
                    {{ section.label }}
                </h3>
                <p class="mt-1 text-sm text-ink-500">
                    {{
                        section.type === 'set'
                            ? 'Готовые наборы на компанию'
                            : 'Добавьте в корзину по одному'
                    }}
                </p>
            </div>

            <div
                class="grid gap-5"
                :class="section.type === 'set' ? 'sm:grid-cols-2 lg:grid-cols-3' : 'sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'"
            >
                <template v-if="section.type === 'set'">
                    <AddToCartSetCard
                        v-for="set in section.items"
                        :key="set.id"
                        :set="set"
                    />
                </template>
                <template v-else>
                    <AddToCartProductCard
                        v-for="product in section.items"
                        :key="product.id"
                        :product="product"
                    />
                </template>
            </div>
        </section>
    </div>
</template>
