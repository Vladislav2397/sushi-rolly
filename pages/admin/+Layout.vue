<script setup lang="ts">
import { computed } from 'vue'
import { usePageContext } from 'vike-vue/usePageContext'
import { AdminShell } from '@widgets/admin-shell'
import { UiToaster } from '@shared'
import '../../app/assets/css/main.css'

const pageContext = usePageContext()
const isLogin = computed(() => pageContext.urlPathname === '/admin/login')
</script>

<template>
    <div>
        <AdminShell v-if="!isLogin">
            <slot />
        </AdminShell>
        <div v-else class="page-shell min-h-dvh">
            <slot />
        </div>
        <UiToaster />
    </div>
</template>
