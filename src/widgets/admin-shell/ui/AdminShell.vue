<script setup lang="ts">
import { computed } from 'vue'
import { navigate } from 'vike/client/router'
import { usePageContext } from 'vike-vue/usePageContext'
import { storeToRefs } from 'pinia'
import { useAdminStore } from '@entities/admin'
import { UiButton } from '@shared'

const pageContext = usePageContext()
const adminStore = useAdminStore()
const { admin } = storeToRefs(adminStore)

const path = computed(() => pageContext.urlPathname)

const links = [
    { label: 'Заказы', to: '/admin/orders' },
    { label: 'Меню', to: '/admin/menu' },
    { label: 'Пользователи', to: '/admin/users' },
]

async function onLogout() {
    await adminStore.logout()
    await navigate('/admin/login')
}
</script>

<template>
    <div class="flex min-h-dvh bg-ink-100">
        <aside class="flex w-60 shrink-0 flex-col border-r border-ink-200 bg-ink-950 text-white">
            <div class="border-b border-white/10 px-5 py-5">
                <p class="font-display text-lg font-semibold">Sushi Rolly</p>
                <p class="mt-1 text-xs text-white/50">Админ-панель</p>
            </div>

            <nav class="flex flex-1 flex-col gap-1 p-3">
                <a
                    v-for="link in links"
                    :key="link.to"
                    :href="link.to"
                    class="rounded-xl px-3 py-2 text-sm transition"
                    :class="
                        path.startsWith(link.to)
                            ? 'bg-brand-600 text-white'
                            : 'text-white/70 hover:bg-white/10 hover:text-white'
                    "
                    @click.prevent="navigate(link.to)"
                >
                    {{ link.label }}
                </a>
            </nav>

            <div class="border-t border-white/10 p-4">
                <p class="truncate text-xs text-white/50">{{ admin?.email }}</p>
                <UiButton
                    color="neutral"
                    variant="ghost"
                    size="sm"
                    class="mt-2 !text-white/80 hover:!bg-white/10"
                    @click="onLogout"
                >
                    Выйти
                </UiButton>
            </div>
        </aside>

        <div class="flex min-w-0 flex-1 flex-col">
            <main class="flex-1 px-6 py-6 sm:px-8">
                <slot />
            </main>
        </div>
    </div>
</template>
