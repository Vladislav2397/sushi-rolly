<script setup lang="ts">
withDefaults(
    defineProps<{
        color?: 'primary' | 'neutral'
        variant?: 'solid' | 'subtle'
        size?: 'sm' | 'md'
        class?: string
    }>(),
    {
        color: 'neutral',
        variant: 'subtle',
        size: 'md',
    },
)
</script>

<template>
    <span
        :class="[
            'inline-flex items-center rounded-full font-medium',
            size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs',
            color === 'primary' && variant === 'solid' && 'bg-brand-600 text-white',
            color === 'primary' && variant === 'subtle' && 'bg-brand-100 text-brand-700',
            color === 'neutral' && variant === 'solid' && 'bg-ink-800 text-white',
            color === 'neutral' && variant === 'subtle' && 'bg-ink-100 text-ink-700',
            $props.class,
        ]"
    >
        <slot />
    </span>
</template>
