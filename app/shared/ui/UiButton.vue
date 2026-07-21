<script setup lang="ts">
import { computed } from 'vue'
import { navigate } from 'vike/client/router'
import UiIcon from './UiIcon.vue'
import { toIconifyName } from './iconName'

const props = withDefaults(
    defineProps<{
        to?: string
        type?: 'button' | 'submit' | 'reset'
        color?: 'primary' | 'neutral'
        variant?: 'solid' | 'soft' | 'ghost' | 'outline' | 'link'
        size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
        icon?: string
        trailingIcon?: string
        block?: boolean
        square?: boolean
        loading?: boolean
        disabled?: boolean
        class?: string
    }>(),
    {
        type: 'button',
        color: 'primary',
        variant: 'solid',
        size: 'md',
    },
)

const iconName = computed(() => toIconifyName(props.icon))
const trailing = computed(() => toIconifyName(props.trailingIcon))

const classes = computed(() => {
    const sizeMap = {
        xs: 'h-7 px-2 text-xs gap-1',
        sm: 'h-8 px-2.5 text-sm gap-1.5',
        md: 'h-9 px-3 text-sm gap-1.5',
        lg: 'h-10 px-4 text-sm gap-2',
        xl: 'h-12 px-5 text-base gap-2',
    }

    const squareMap = {
        xs: 'size-7 px-0',
        sm: 'size-8 px-0',
        md: 'size-9 px-0',
        lg: 'size-10 px-0',
        xl: 'size-12 px-0',
    }

    const colorVariant: Record<string, string> = {
        'primary-solid': 'bg-brand-600 text-white hover:bg-brand-700',
        'primary-soft': 'bg-brand-100 text-brand-700 hover:bg-brand-200',
        'primary-ghost': 'text-brand-700 hover:bg-brand-50',
        'primary-outline': 'border border-brand-300 text-brand-700 hover:bg-brand-50',
        'primary-link': 'text-brand-700 hover:underline px-0 h-auto',
        'neutral-solid': 'bg-ink-900 text-white hover:bg-ink-800',
        'neutral-soft': 'bg-ink-100 text-ink-800 hover:bg-ink-200',
        'neutral-ghost': 'text-ink-700 hover:bg-ink-100',
        'neutral-outline': 'border border-ink-300 text-ink-800 hover:bg-ink-50',
        'neutral-link': 'text-ink-600 hover:underline px-0 h-auto',
    }

    return [
        'inline-flex items-center justify-center rounded-xl font-medium transition disabled:opacity-50 disabled:pointer-events-none',
        props.square ? squareMap[props.size] : sizeMap[props.size],
        props.block ? 'w-full' : '',
        colorVariant[`${props.color}-${props.variant}`] ?? colorVariant['primary-solid'],
        props.class,
    ]
})

async function onClick(event: MouseEvent) {
    if (!props.to || props.disabled || props.loading) {
        return
    }

    if (props.to.startsWith('#')) {
        return
    }

    event.preventDefault()
    await navigate(props.to)
}
</script>

<template>
    <a
        v-if="to"
        :href="to"
        :class="classes"
        :aria-disabled="disabled || loading ? 'true' : undefined"
        @click="onClick"
    >
        <UiIcon v-if="loading" name="lucide:loader-circle" class="size-4 animate-spin" />
        <UiIcon v-else-if="iconName" :name="iconName" class="size-4" />
        <slot />
        <UiIcon v-if="trailing && !loading" :name="trailing" class="size-4" />
    </a>
    <button
        v-else
        :type="type"
        :class="classes"
        :disabled="disabled || loading"
    >
        <UiIcon v-if="loading" name="lucide:loader-circle" class="size-4 animate-spin" />
        <UiIcon v-else-if="iconName" :name="iconName" class="size-4" />
        <slot />
        <UiIcon v-if="trailing && !loading" :name="trailing" class="size-4" />
    </button>
</template>
