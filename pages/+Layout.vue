<script setup lang="ts">
import { computed } from 'vue'
import { usePageContext } from 'vike-vue/usePageContext'
import { AppHeader } from '@widgets/header'
import { UiToaster } from '@shared'
import '../app/assets/css/main.css'

const pageContext = usePageContext()
const isAdmin = computed(() => pageContext.urlPathname.startsWith('/admin'))
</script>

<template>
    <div v-if="isAdmin">
        <slot />
    </div>
    <div v-else class="page-shell min-h-dvh">
        <AppHeader />
        <main class="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
            <slot />
        </main>
        <UiToaster />
    </div>
</template>
