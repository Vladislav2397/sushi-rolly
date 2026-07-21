import { defineStore } from 'pinia'
import { ref } from 'vue'
import { toIconifyName } from './iconName'

export interface ToastItem {
    id: string
    title: string
    description?: string
    color?: 'success' | 'error' | 'neutral'
    icon?: string
}

export const useToastStore = defineStore('toast', () => {
    const items = ref<ToastItem[]>([])

    function add(input: Omit<ToastItem, 'id'>) {
        const id = `toast_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`
        items.value = [
            ...items.value,
            {
                ...input,
                id,
                icon: toIconifyName(input.icon),
            },
        ]

        window.setTimeout(() => remove(id), 3200)
    }

    function remove(id: string) {
        items.value = items.value.filter((item) => item.id !== id)
    }

    return { items, add, remove }
})

export function useToast() {
    return useToastStore()
}
