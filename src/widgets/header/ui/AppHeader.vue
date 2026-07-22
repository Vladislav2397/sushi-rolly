<script setup lang="ts">
import { computed } from 'vue'
import { navigate } from 'vike/client/router'
import { usePageContext } from 'vike-vue/usePageContext'
import { storeToRefs } from 'pinia'
import { useUserStore } from '@entities/user'
import { useCartStore } from '@entities/cart'
import { formatPhone, RESTAURANT, UiBadge, UiButton } from '@shared'

const pageContext = usePageContext()
const userStore = useUserStore()
const cartStore = useCartStore()
const { user, isAuthenticated } = storeToRefs(userStore)
const { totalCount } = storeToRefs(cartStore)

const path = computed(() => pageContext.urlPathname)

const links = computed(() => [
    { label: 'Меню', to: '/', active: path.value === '/' },
    { label: 'Корзина', to: '/cart', active: path.value === '/cart' },
    { label: 'Заказы', to: '/orders', active: path.value.startsWith('/orders') },
])

async function onLogout() {
    await userStore.logout()
    await navigate('/')
}
</script>

<template>
    <header class="sticky top-0 z-40 border-b border-ink-200/70 bg-white/80 backdrop-blur-md">
        <div class="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
            <a href="/" class="group flex items-center gap-3" @click.prevent="navigate('/')">
                <span
                    class="flex size-10 items-center justify-center rounded-2xl bg-ink-950 font-display text-sm font-bold text-white transition group-hover:bg-brand-600"
                >
                    SR
                </span>
                <span class="leading-tight">
                    <span class="block font-display text-lg font-semibold tracking-tight text-ink-950">
                        {{ RESTAURANT.name }}
                    </span>
                    <span class="hidden text-xs text-ink-500 sm:block">{{ RESTAURANT.tagline }}</span>
                </span>
            </a>

            <nav class="hidden items-center gap-1 md:flex">
                <UiButton
                    v-for="link in links"
                    :key="link.to"
                    :to="link.to"
                    :color="link.active ? 'primary' : 'neutral'"
                    :variant="link.active ? 'soft' : 'ghost'"
                    size="sm"
                >
                    {{ link.label }}
                    <template v-if="link.to === '/cart' && totalCount">
                        <UiBadge color="primary" variant="solid" size="sm" class="ml-1">
                            {{ totalCount }}
                        </UiBadge>
                    </template>
                </UiButton>
            </nav>

            <div class="flex items-center gap-2">
                <UiButton
                    to="/cart"
                    color="neutral"
                    variant="soft"
                    icon="i-lucide-shopping-bag"
                    class="md:hidden"
                    :aria-label="`Корзина, ${totalCount} позиций`"
                >
                    <UiBadge v-if="totalCount" color="primary" variant="solid" size="sm">
                        {{ totalCount }}
                    </UiBadge>
                </UiButton>

                <template v-if="isAuthenticated">
                    <div class="hidden text-right sm:block">
                        <p class="text-xs text-ink-500">Вы вошли</p>
                        <p class="text-sm font-medium">{{ formatPhone(user!.phone) }}</p>
                    </div>
                    <UiButton
                        color="neutral"
                        variant="ghost"
                        icon="i-lucide-log-out"
                        aria-label="Выйти"
                        @click="onLogout"
                    />
                </template>
                <UiButton
                    v-else
                    to="/auth"
                    color="primary"
                    variant="soft"
                    icon="i-lucide-user"
                >
                    Войти
                </UiButton>
            </div>
        </div>

        <nav class="flex gap-1 overflow-x-auto border-t border-ink-100 px-4 py-2 md:hidden">
            <UiButton
                v-for="link in links"
                :key="link.to"
                :to="link.to"
                :color="link.active ? 'primary' : 'neutral'"
                :variant="link.active ? 'soft' : 'ghost'"
                size="sm"
                class="shrink-0"
            >
                {{ link.label }}
            </UiButton>
        </nav>
    </header>
</template>
