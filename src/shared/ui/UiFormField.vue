<script setup lang="ts">
defineProps<{
    label?: string
    name?: string
    error?: string
    class?: string
}>()
</script>

<template>
    <div :class="['space-y-1.5', $props.class]">
        <label v-if="label" :for="name" class="block text-sm font-medium text-ink-800">
            {{ label }}
        </label>
        <slot />
        <p v-if="error" class="text-sm text-brand-600">{{ error }}</p>
    </div>
</template>
