<script setup lang="ts">
const model = defineModel<string>({ default: '' })

withDefaults(
    defineProps<{
        rows?: number
        placeholder?: string
        class?: string
    }>(),
    {
        rows: 3,
    },
)
</script>

<template>
    <textarea
        v-model="model"
        :rows="rows"
        :placeholder="placeholder"
        :class="[
            'w-full rounded-xl border border-ink-200 bg-white px-3 py-2 text-sm text-ink-950 outline-none transition placeholder:text-ink-400 focus:border-brand-400 focus:ring-2 focus:ring-brand-100',
            $props.class,
        ]"
    />
</template>
