<script setup lang="ts">
import { storeToRefs } from 'pinia'
import UiIcon from './UiIcon.vue'
import { useToastStore } from './useToast'

const toast = useToastStore()
const { items } = storeToRefs(toast)
</script>

<template>
    <div class="pointer-events-none fixed right-4 bottom-4 z-50 flex w-full max-w-sm flex-col gap-2">
        <div
            v-for="item in items"
            :key="item.id"
            class="pointer-events-auto flex items-start gap-3 rounded-2xl bg-ink-950 px-4 py-3 text-white shadow-xl ring-1 ring-white/10"
        >
            <UiIcon
                v-if="item.icon"
                :name="item.icon"
                class="mt-0.5 size-5 shrink-0 text-brand-300"
            />
            <div class="min-w-0 flex-1">
                <p class="text-sm font-semibold">{{ item.title }}</p>
                <p v-if="item.description" class="mt-0.5 text-sm text-white/70">
                    {{ item.description }}
                </p>
            </div>
            <button
                type="button"
                class="text-white/50 transition hover:text-white"
                aria-label="Закрыть"
                @click="toast.remove(item.id)"
            >
                ×
            </button>
        </div>
    </div>
</template>
