<script setup lang="ts">
import { computed } from 'vue'

const model = defineModel<string[]>({ default: () => [] })

const props = withDefaults(
    defineProps<{
        length?: number
        size?: 'md' | 'lg' | 'xl'
        placeholder?: string
    }>(),
    {
        length: 4,
        size: 'xl',
        placeholder: '○',
    },
)

const digits = computed({
    get: () => {
        const values = [...model.value]
        while (values.length < props.length) {
            values.push('')
        }
        return values.slice(0, props.length)
    },
    set: (value) => {
        model.value = value
    },
})

function onInput(index: number, event: Event) {
    const target = event.target as HTMLInputElement
    const char = target.value.replace(/\D/g, '').slice(-1)
    const next = [...digits.value]
    next[index] = char
    digits.value = next

    if (char && index < props.length - 1) {
        const el = (event.target as HTMLElement).parentElement?.children[index + 1] as
            | HTMLInputElement
            | undefined
        el?.focus()
    }
}

function onKeydown(index: number, event: KeyboardEvent) {
    if (event.key === 'Backspace' && !digits.value[index] && index > 0) {
        const el = (event.target as HTMLElement).parentElement?.children[index - 1] as
            | HTMLInputElement
            | undefined
        el?.focus()
    }
}
</script>

<template>
    <div class="flex gap-2">
        <input
            v-for="(_, index) in length"
            :key="index"
            :value="digits[index]"
            inputmode="numeric"
            maxlength="1"
            :placeholder="placeholder"
            :class="[
                'rounded-xl border border-ink-200 bg-white text-center font-semibold text-ink-950 outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100',
                size === 'xl' ? 'size-12 text-lg' : size === 'lg' ? 'size-10 text-base' : 'size-9 text-sm',
            ]"
            @input="onInput(index, $event)"
            @keydown="onKeydown(index, $event)"
        />
    </div>
</template>
