<script setup lang="ts">
import { watchEffect } from 'vue'
import { storeToRefs } from 'pinia'
import { navigate } from 'vike/client/router'
import { usePageContext } from 'vike-vue/usePageContext'
import { useUserStore } from '@entities/user'
import { AuthByPhoneForm } from '@features/auth-by-phone'

const pageContext = usePageContext()
const userStore = useUserStore()
const { isAuthenticated } = storeToRefs(userStore)

function redirectAfterAuth() {
    const redirect =
        typeof pageContext.urlParsed.search.redirect === 'string'
            ? pageContext.urlParsed.search.redirect
            : '/'
    return navigate(redirect)
}

watchEffect(() => {
    if (isAuthenticated.value) {
        void redirectAfterAuth()
    }
})
</script>

<template>
    <div class="flex min-h-[70vh] items-center justify-center py-4">
        <AuthByPhoneForm @success="redirectAfterAuth" />
    </div>
</template>
