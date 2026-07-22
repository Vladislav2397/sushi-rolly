import { mount, type MountingOptions } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import type { Component } from 'vue'

export function createTestPinia() {
    const pinia = createPinia()
    setActivePinia(pinia)
    return pinia
}

export function mountWithPinia<Props extends Record<string, unknown>>(
    component: Component,
    options: MountingOptions<Props> = {},
) {
    const pinia = createTestPinia()
    return mount(component, {
        ...options,
        global: {
            ...options.global,
            plugins: [...(options.global?.plugins ?? []), pinia],
        },
    } as never)
}
