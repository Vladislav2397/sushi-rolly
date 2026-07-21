<script setup lang="ts">
import { MenuCatalog } from '@widgets/menu-catalog'
import { RESTAURANT } from '@shared'

useSeoMeta({
    title: `${RESTAURANT.name} — меню`,
    description: RESTAURANT.tagline,
})

const menuNav = [
    { label: 'Сеты', to: '#sets' },
    { label: 'Суши', to: '#sushi' },
    { label: 'Роллы', to: '#rolls' },
    { label: 'Напитки', to: '#drinks' },
]
</script>

<template>
    <div class="space-y-8">
        <section
            class="hero-surface relative overflow-hidden rounded-[2rem] px-6 py-10 text-white sm:px-10 sm:py-14"
        >
            <div
                class="pointer-events-none absolute -right-10 top-1/2 hidden h-64 w-64 -translate-y-1/2 rounded-full bg-brand-500/30 blur-3xl sm:block"
            />
            <div class="relative max-w-xl">
                <p class="text-xs tracking-[0.25em] text-brand-200 uppercase">Быстрое питание · роллы</p>
                <h1 class="mt-3 font-display text-4xl font-bold tracking-tight sm:text-5xl">
                    {{ RESTAURANT.name }}
                </h1>
                <p class="mt-4 max-w-md text-base text-white/75 sm:text-lg">
                    Сеты, суши, роллы и напитки — самовывоз или доставка до двери.
                </p>
                <div class="mt-7 flex flex-wrap gap-3">
                    <UButton
                        to="#menu"
                        size="xl"
                        color="primary"
                    >
                        Смотреть меню
                    </UButton>
                    <UButton
                        to="/cart"
                        size="xl"
                        color="neutral"
                        variant="outline"
                        class="border-white/30 bg-white/5 text-white hover:bg-white/10"
                    >
                        Корзина
                    </UButton>
                </div>
            </div>
        </section>

        <section id="menu" class="scroll-mt-24 space-y-5">
            <div class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <h2 class="font-display text-2xl font-semibold text-ink-950 sm:text-3xl">
                        Меню
                    </h2>
                    <p class="mt-1 text-sm text-ink-500">
                        Сеты, суши, роллы и напитки
                    </p>
                </div>

                <div class="flex flex-wrap gap-2">
                    <UButton
                        v-for="link in menuNav"
                        :key="link.to"
                        :to="link.to"
                        color="neutral"
                        variant="soft"
                        size="sm"
                    >
                        {{ link.label }}
                    </UButton>
                </div>
            </div>

            <MenuCatalog />
        </section>
    </div>
</template>
