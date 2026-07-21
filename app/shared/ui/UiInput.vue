<script setup lang="ts">
import { computed } from 'vue'
import UiIcon from './UiIcon.vue'
import { toIconifyName } from './iconName'

const model = defineModel<string>({ default: '' })

const props = withDefaults(
    defineProps<{
        type?: string
        size?: 'md' | 'lg' | 'xl'
        icon?: string
        placeholder?: string
        autocomplete?: string
        class?: string
    }>(),
    {
        type: 'text',
        size: 'md',
    },
)

const iconName = computed(() => toIconifyName(props.icon))

const sizeClass = computed(() => {
    if (props.size === 'xl') return 'h-12 text-base'
    if (props.size === 'lg') return 'h-10 text-sm'
    return 'h-9 text-sm'
})
</script>

<template>
    <div :class="['relative w-full', props.class]">
        <UiIcon
            v-if="iconName"
            :name="iconName"
            class="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-ink-400"
        />
        <input
            v-model="model"
            :type="type"
            :placeholder="placeholder"
            :autocomplete="autocomplete"
            :class="[
                'w-full rounded-xl border border-ink-200 bg-white text-ink-950 outline-none transition placeholder:text-ink-400 focus:border-brand-400 focus:ring-2 focus:ring-brand-100',
                sizeClass,
                iconName ? 'pl-10 pr-3' : 'px-3',
            ]"
        />
    </div>
</template>
