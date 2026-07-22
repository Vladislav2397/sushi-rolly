import { config } from '@vue/test-utils'
import { beforeEach, vi } from 'vitest'

vi.mock('@iconify/vue', () => ({
    Icon: {
        name: 'Icon',
        props: ['icon'],
        template: '<span data-testid="icon" />',
    },
}))

config.global.stubs = {
    teleport: true,
}

beforeEach(() => {
    localStorage.clear()
})
