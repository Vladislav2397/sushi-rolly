<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { api } from '@shared/api'
import { formatPrice, UiButton, UiFormField, UiInput, UiSkeleton, UiTextarea, useToast } from '@shared'
import { MENU_CATEGORY_LABEL, type MenuCategory } from '@entities/menu'

interface AdminMenuItem {
    id: string
    category: MenuCategory
    title: string
    description: string
    price: number
    pieces: number | null
    weight: number | null
    volume: number | null
    number: number | null
    accent: string | null
    tags: string[]
    sortOrder: number
}

const emptyForm = (): Omit<AdminMenuItem, 'tags'> & { tagsText: string } => ({
    id: '',
    category: 'set',
    title: '',
    description: '',
    price: 0,
    pieces: null,
    weight: null,
    volume: null,
    number: null,
    accent: '',
    tagsText: '',
    sortOrder: 0,
})

const CATEGORIES: MenuCategory[] = ['set', 'sushi', 'roll', 'drink']

const items = ref<AdminMenuItem[]>([])
const pending = ref(true)
const error = ref('')
const editingId = ref<string | null>(null)
const saving = ref(false)
const form = reactive(emptyForm())
const toast = useToast()

const isEditing = computed(() => editingId.value !== null)

async function load() {
    pending.value = true
    error.value = ''
    try {
        const data = await api<{ items: AdminMenuItem[] }>('/api/admin/menu')
        items.value = data.items
    } catch {
        error.value = 'Не удалось загрузить меню'
    } finally {
        pending.value = false
    }
}

function resetForm() {
    Object.assign(form, emptyForm())
    editingId.value = null
}

function startCreate() {
    resetForm()
    editingId.value = 'new'
}

function startEdit(item: AdminMenuItem) {
    editingId.value = item.id
    Object.assign(form, {
        id: item.id,
        category: item.category,
        title: item.title,
        description: item.description,
        price: item.price,
        pieces: item.pieces,
        weight: item.weight,
        volume: item.volume,
        number: item.number,
        accent: item.accent ?? '',
        tagsText: item.tags.join(', '),
        sortOrder: item.sortOrder,
    })
}

function toPayload() {
    const toNum = (value: number | null | string) => {
        if (value === null || value === '') {
            return null
        }
        const num = Number(value)
        return Number.isFinite(num) ? num : null
    }

    return {
        id: String(form.id).trim(),
        category: form.category,
        title: String(form.title).trim(),
        description: String(form.description).trim(),
        price: Number(form.price) || 0,
        pieces: toNum(form.pieces as number | null),
        weight: toNum(form.weight as number | null),
        volume: toNum(form.volume as number | null),
        number: toNum(form.number as number | null),
        accent: String(form.accent ?? '').trim() || null,
        tags: String(form.tagsText)
            .split(',')
            .map((tag) => tag.trim())
            .filter(Boolean),
        sortOrder: Number(form.sortOrder) || 0,
    }
}

async function save() {
    saving.value = true
    error.value = ''
    try {
        const payload = toPayload()

        if (editingId.value === 'new') {
            const data = await api<{ item: AdminMenuItem }>('/api/admin/menu', {
                method: 'POST',
                body: payload,
            })
            items.value = [...items.value, data.item].sort((a, b) => a.sortOrder - b.sortOrder)
            toast.add({ title: 'Позиция создана', color: 'success' })
        } else if (editingId.value) {
            const data = await api<{ item: AdminMenuItem }>(`/api/admin/menu/${editingId.value}`, {
                method: 'PUT',
                body: payload,
            })
            items.value = items.value.map((item) => (item.id === data.item.id ? data.item : item))
            toast.add({ title: 'Позиция обновлена', color: 'success' })
        }

        resetForm()
    } catch {
        error.value = 'Не удалось сохранить позицию'
    } finally {
        saving.value = false
    }
}

async function remove(item: AdminMenuItem) {
    if (!window.confirm(`Удалить «${item.title}»?`)) {
        return
    }

    try {
        await api(`/api/admin/menu/${item.id}`, { method: 'DELETE' })
        items.value = items.value.filter((entry) => entry.id !== item.id)
        if (editingId.value === item.id) {
            resetForm()
        }
        toast.add({ title: 'Позиция удалена', color: 'success' })
    } catch {
        error.value = 'Не удалось удалить позицию'
    }
}

onMounted(() => {
    void load()
})
</script>

<template>
    <div class="space-y-6">
        <div class="flex flex-wrap items-end justify-between gap-3">
            <div>
                <h1 class="font-display text-3xl font-semibold text-ink-950">Меню</h1>
                <p class="mt-1 text-sm text-ink-500">Создание и редактирование позиций</p>
            </div>
            <UiButton v-if="!isEditing" @click="startCreate">Добавить позицию</UiButton>
            <UiButton v-else color="neutral" variant="soft" @click="resetForm">Отмена</UiButton>
        </div>

        <p v-if="error" class="text-sm text-brand-600">{{ error }}</p>

        <form
            v-if="isEditing"
            class="grid gap-4 rounded-2xl bg-white p-5 ring-1 ring-ink-200/80 sm:grid-cols-2"
            @submit.prevent="save"
        >
            <UiFormField label="ID" name="id">
                <UiInput v-model="form.id" :disabled="editingId !== 'new'" placeholder="set-7" />
            </UiFormField>

            <UiFormField label="Категория" name="category">
                <select
                    v-model="form.category"
                    class="h-9 w-full rounded-xl border border-ink-200 bg-white px-3 text-sm outline-none focus:border-brand-400"
                >
                    <option v-for="category in CATEGORIES" :key="category" :value="category">
                        {{ MENU_CATEGORY_LABEL[category] }}
                    </option>
                </select>
            </UiFormField>

            <UiFormField label="Название" name="title" class="sm:col-span-2">
                <UiInput v-model="form.title" />
            </UiFormField>

            <UiFormField label="Описание" name="description" class="sm:col-span-2">
                <UiTextarea v-model="form.description" :rows="3" />
            </UiFormField>

            <UiFormField label="Цена, ₽" name="price">
                <UiInput v-model.number="form.price" type="number" />
            </UiFormField>

            <UiFormField label="Порядок" name="sortOrder">
                <UiInput v-model.number="form.sortOrder" type="number" />
            </UiFormField>

            <UiFormField label="Шт" name="pieces">
                <UiInput v-model.number="form.pieces" type="number" />
            </UiFormField>

            <UiFormField label="Вес, г" name="weight">
                <UiInput v-model.number="form.weight" type="number" />
            </UiFormField>

            <UiFormField label="Объём, мл" name="volume">
                <UiInput v-model.number="form.volume" type="number" />
            </UiFormField>

            <UiFormField label="Номер сета" name="number">
                <UiInput v-model.number="form.number" type="number" />
            </UiFormField>

            <UiFormField label="Accent (#hex)" name="accent">
                <UiInput v-model="form.accent" placeholder="#f24d2c" />
            </UiFormField>

            <UiFormField label="Теги (через запятую)" name="tags" class="sm:col-span-2">
                <UiInput v-model="form.tagsText" placeholder="хит, лосось" />
            </UiFormField>

            <div class="sm:col-span-2">
                <UiButton type="submit" :loading="saving">
                    {{ editingId === 'new' ? 'Создать' : 'Сохранить' }}
                </UiButton>
            </div>
        </form>

        <div v-if="pending" class="space-y-3">
            <UiSkeleton v-for="n in 5" :key="n" class="h-16 rounded-2xl" />
        </div>

        <div v-else class="overflow-hidden rounded-2xl bg-white ring-1 ring-ink-200/80">
            <table class="w-full text-left text-sm">
                <thead class="border-b border-ink-100 bg-ink-50 text-ink-500">
                    <tr>
                        <th class="px-4 py-3 font-medium">Позиция</th>
                        <th class="px-4 py-3 font-medium">Категория</th>
                        <th class="px-4 py-3 font-medium">Цена</th>
                        <th class="px-4 py-3 font-medium"></th>
                    </tr>
                </thead>
                <tbody>
                    <tr
                        v-for="item in items"
                        :key="item.id"
                        class="border-b border-ink-100 last:border-0"
                    >
                        <td class="px-4 py-3">
                            <p class="font-medium text-ink-950">{{ item.title }}</p>
                            <p class="text-xs text-ink-400">{{ item.id }}</p>
                        </td>
                        <td class="px-4 py-3">{{ MENU_CATEGORY_LABEL[item.category] }}</td>
                        <td class="px-4 py-3">{{ formatPrice(item.price) }}</td>
                        <td class="px-4 py-3 text-right">
                            <UiButton size="sm" color="neutral" variant="ghost" @click="startEdit(item)">
                                Изменить
                            </UiButton>
                            <UiButton size="sm" color="neutral" variant="ghost" @click="remove(item)">
                                Удалить
                            </UiButton>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>
