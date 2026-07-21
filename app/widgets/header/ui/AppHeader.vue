<script setup lang="ts">
import { formatPhone, RESTAURANT } from '@shared'

const route = useRoute()
const { user, isAuthenticated, logout } = useUserStore()
const { totalCount } = useCartStore()

const links = computed(() => [
    { label: 'Меню', to: '/', active: route.path === '/' },
    { label: 'Корзина', to: '/cart', active: route.path === '/cart' },
    { label: 'Заказы', to: '/orders', active: route.path.startsWith('/orders') },
])

function onLogout() {
    logout()
    navigateTo('/')
}
</script>

<template>
    <header class="sticky top-0 z-40 border-b border-ink-200/70 bg-white/80 backdrop-blur-md">
        <div class="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
            <NuxtLink to="/" class="group flex items-center gap-3">
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
            </NuxtLink>

            <nav class="hidden items-center gap-1 md:flex">
                <UButton
                    v-for="link in links"
                    :key="link.to"
                    :to="link.to"
                    :color="link.active ? 'primary' : 'neutral'"
                    :variant="link.active ? 'soft' : 'ghost'"
                    size="sm"
                >
                    {{ link.label }}
                    <template v-if="link.to === '/cart' && totalCount">
                        <UBadge
                            color="primary"
                            variant="solid"
                            size="sm"
                            class="ml-1"
                        >
                            {{ totalCount }}
                        </UBadge>
                    </template>
                </UButton>
            </nav>

            <div class="flex items-center gap-2">
                <UButton
                    to="/cart"
                    color="neutral"
                    variant="soft"
                    icon="i-lucide-shopping-bag"
                    class="md:hidden"
                    :aria-label="`Корзина, ${totalCount} позиций`"
                >
                    <UBadge
                        v-if="totalCount"
                        color="primary"
                        variant="solid"
                        size="sm"
                    >
                        {{ totalCount }}
                    </UBadge>
                </UButton>

                <template v-if="isAuthenticated">
                    <div class="hidden text-right sm:block">
                        <p class="text-xs text-ink-500">Вы вошли</p>
                        <p class="text-sm font-medium">{{ formatPhone(user!.phone) }}</p>
                    </div>
                    <UButton
                        color="neutral"
                        variant="ghost"
                        icon="i-lucide-log-out"
                        aria-label="Выйти"
                        @click="onLogout"
                    />
                </template>
                <UButton
                    v-else
                    to="/auth"
                    color="primary"
                    variant="soft"
                    icon="i-lucide-user"
                >
                    Войти
                </UButton>
            </div>
        </div>

        <nav class="flex gap-1 overflow-x-auto border-t border-ink-100 px-4 py-2 md:hidden">
            <UButton
                v-for="link in links"
                :key="link.to"
                :to="link.to"
                :color="link.active ? 'primary' : 'neutral'"
                :variant="link.active ? 'soft' : 'ghost'"
                size="sm"
                class="shrink-0"
            >
                {{ link.label }}
            </UButton>
        </nav>
    </header>
</template>
