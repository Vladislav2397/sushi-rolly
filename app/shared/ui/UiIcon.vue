<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { computed } from 'vue'
import { toIconifyName } from './iconName'

const props = defineProps<{
    name: string
    class?: string
}>()

const icon = computed(() => toIconifyName(props.name) ?? props.name)
</script>

<template>
    <Icon :icon="icon" :class="['inline-block shrink-0', props.class]" aria-hidden="true" />
</template>
