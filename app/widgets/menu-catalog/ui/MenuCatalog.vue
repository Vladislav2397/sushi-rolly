<script setup lang="ts">
import { MENU_CATEGORY_LABEL } from '@entities/menu'
import { api, type ApiMenuResponse } from '@shared/api'

const { data, pending, error, refresh } = await useAsyncData(
    'menu',
    () => api<ApiMenuResponse>('/api/menu'),
    { server: false },
)

const sections = computed(() => {
    if (!data.value) {
        return []
    }

    return [
        { id: 'sets', label: MENU_CATEGORY_LABEL.set, items: data.value.sets, type: 'set' as const },
        { id: 'sushi', label: MENU_CATEGORY_LABEL.sushi, items: data.value.sushi, type: 'product' as const },
        { id: 'rolls', label: MENU_CATEGORY_LABEL.roll, items: data.value.rolls, type: 'product' as const },
        { id: 'drinks', label: MENU_CATEGORY_LABEL.drink, items: data.value.drinks, type: 'product' as const },
    ]
})
</script>

<template>
    <div v-if="pending" class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <USkeleton v-for="n in 6" :key="n" class="h-72 rounded-3xl" />
    </div>

    <div v-else-if="error" class="rounded-3xl bg-white px-6 py-12 text-center ring-1 ring-ink-200/80">
        <p class="text-ink-600">Не удалось загрузить меню</p>
        <UButton class="mt-4" @click="refresh()">Повторить</UButton>
    </div>

    <div v-else class="space-y-10">
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
