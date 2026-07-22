import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { MenuSetCard } from '@entities/menu'
import type { MenuSet } from '@entities/menu'
import { UiButton } from '@shared'

const sampleSet: MenuSet = {
    id: 'set-1',
    category: 'set',
    title: 'Сет «Классика»',
    description: 'Филадельфия, Калифорния, ролл с лососем и маки с огурцом.',
    price: 1290,
    pieces: 32,
    weight: 980,
    number: 1,
    accent: '#f24d2c',
    tags: ['хит', 'лосось'],
}

const meta = {
    title: 'Entities/MenuSetCard',
    component: MenuSetCard,
    tags: ['autodocs'],
    parameters: {
        layout: 'padded',
    },
} satisfies Meta<typeof MenuSetCard>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
    args: { item: sampleSet },
    render: (args) => ({
        components: { MenuSetCard, UiButton },
        setup: () => ({ args }),
        template: `
      <div class="max-w-sm">
        <MenuSetCard :item="args.item">
          <template #action>
            <UiButton icon="i-lucide-plus" color="primary">В корзину</UiButton>
          </template>
        </MenuSetCard>
      </div>
    `,
    }),
}
