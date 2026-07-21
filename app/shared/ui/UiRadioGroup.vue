<script setup lang="ts">
import { RadioGroupIndicator, RadioGroupItem, RadioGroupRoot } from 'reka-ui'

export interface RadioGroupOption {
    label: string
    description?: string
    value: string
}

const model = defineModel<string>({ required: true })

defineProps<{
    items: RadioGroupOption[]
    class?: string
}>()
</script>

<template>
    <RadioGroupRoot v-model="model" :class="['grid gap-3', $props.class]">
        <RadioGroupItem
            v-for="item in items"
            :key="item.value"
            :value="item.value"
            class="group flex cursor-pointer items-start gap-3 rounded-2xl border border-ink-200 bg-white p-4 text-left outline-none transition hover:border-brand-300 data-[state=checked]:border-brand-500 data-[state=checked]:bg-brand-50/40 data-[state=checked]:ring-2 data-[state=checked]:ring-brand-100"
        >
            <span
                class="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border border-ink-300 group-data-[state=checked]:border-brand-600"
            >
                <RadioGroupIndicator class="size-2.5 rounded-full bg-brand-600" />
            </span>
            <span class="min-w-0">
                <span class="block font-medium text-ink-950">{{ item.label }}</span>
                <span v-if="item.description" class="mt-0.5 block text-sm text-ink-500">
                    {{ item.description }}
                </span>
            </span>
        </RadioGroupItem>
    </RadioGroupRoot>
</template>
