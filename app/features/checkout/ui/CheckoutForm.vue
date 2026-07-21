<script setup lang="ts">
import type { RadioGroupItem } from '@nuxt/ui'
import { useUserStore } from '@entities/user'
import { useCartStore } from '@entities/cart'
import { useOrderStore, type OrderFulfillment } from '@entities/order'
import { formatPrice, RESTAURANT } from '@shared'

const emit = defineEmits<{
    success: []
    'need-auth': []
}>()

const toast = useToast()
const { user } = useUserStore()
const { items, totalPrice, isEmpty, clear } = useCartStore()
const { createOrder, calcDeliveryFee } = useOrderStore()

const fulfillment = ref<OrderFulfillment>('pickup')
const address = ref('')
const comment = ref('')
const loading = ref(false)
const error = ref('')

const fulfillmentItems = computed<RadioGroupItem[]>(() => [
    {
        label: 'Самовывоз',
        description: `Готово через ~${RESTAURANT.pickupEtaMin} мин · ${RESTAURANT.address}`,
        value: 'pickup',
    },
    {
        label: 'Доставка',
        description: `~${RESTAURANT.deliveryEtaMin} мин · от ${formatPrice(RESTAURANT.deliveryFee)}`,
        value: 'delivery',
    },
])

const deliveryFee = computed(() => calcDeliveryFee(totalPrice.value, fulfillment.value))
const grandTotal = computed(() => totalPrice.value + deliveryFee.value)

async function submit() {
    error.value = ''

    if (!user.value) {
        emit('need-auth')
        return
    }

    if (isEmpty.value) {
        error.value = 'Корзина пуста'
        return
    }

    if (fulfillment.value === 'delivery' && address.value.trim().length < 5) {
        error.value = 'Укажите адрес доставки'
        return
    }

    loading.value = true
    try {
        const order = await createOrder({
            userId: user.value.id,
            phone: user.value.phone,
            items: items.value,
            fulfillment: fulfillment.value,
            address: address.value.trim(),
            comment: comment.value,
        })

        clear()

        toast.add({
            title: 'Заказ оформлен',
            description: `Номер ${order.id.slice(-6).toUpperCase()}`,
            color: 'success',
            icon: 'i-lucide-check-circle',
        })

        emit('success')
    } catch {
        error.value = 'Не удалось оформить заказ'
    } finally {
        loading.value = false
    }
}
</script>

<template>
    <form class="space-y-6" @submit.prevent="submit">
        <section class="rounded-3xl bg-white p-5 ring-1 ring-ink-200/80 sm:p-6">
            <h2 class="font-display text-xl font-semibold">Способ получения</h2>
            <URadioGroup
                v-model="fulfillment"
                :items="fulfillmentItems"
                variant="card"
                indicator="start"
                class="mt-4"
            />

            <UFormField
                v-if="fulfillment === 'delivery'"
                class="mt-4"
                label="Адрес доставки"
                name="address"
                :error="error && fulfillment === 'delivery' ? error : undefined"
            >
                <UInput
                    v-model="address"
                    size="lg"
                    icon="i-lucide-map-pin"
                    placeholder="Улица, дом, квартира"
                    class="w-full"
                />
            </UFormField>

            <UFormField class="mt-4" label="Комментарий к заказу" name="comment">
                <UTextarea
                    v-model="comment"
                    :rows="3"
                    placeholder="Домофон, этаж, пожелания..."
                    class="w-full"
                />
            </UFormField>
        </section>

        <section class="rounded-3xl bg-white p-5 ring-1 ring-ink-200/80 sm:p-6">
            <h2 class="font-display text-xl font-semibold">Итого</h2>

            <dl class="mt-4 space-y-2 text-sm">
                <div class="flex justify-between gap-3">
                    <dt class="text-ink-500">Сеты</dt>
                    <dd class="font-medium">{{ formatPrice(totalPrice) }}</dd>
                </div>
                <div class="flex justify-between gap-3">
                    <dt class="text-ink-500">Доставка</dt>
                    <dd class="font-medium">
                        {{ deliveryFee === 0 ? 'Бесплатно' : formatPrice(deliveryFee) }}
                    </dd>
                </div>
                <div class="flex justify-between gap-3 border-t border-ink-100 pt-3 text-base">
                    <dt class="font-display font-semibold">К оплате</dt>
                    <dd class="font-display text-lg font-semibold">{{ formatPrice(grandTotal) }}</dd>
                </div>
            </dl>

            <p
                v-if="fulfillment === 'delivery' && totalPrice < RESTAURANT.freeDeliveryFrom"
                class="mt-3 text-xs text-ink-500"
            >
                Бесплатная доставка от {{ formatPrice(RESTAURANT.freeDeliveryFrom) }}
            </p>

            <p v-if="error && fulfillment === 'pickup'" class="mt-3 text-sm text-brand-600">
                {{ error }}
            </p>

            <UButton
                type="submit"
                size="xl"
                block
                class="mt-5"
                :loading="loading"
                :disabled="isEmpty"
            >
                Подтвердить заказ
            </UButton>
        </section>
    </form>
</template>
