<script setup lang="ts">
defineProps<{
    class?: string
}>()
</script>

<template>
    <div :class="['animate-pulse rounded-xl bg-ink-200/80', $props.class]" />
</template>
