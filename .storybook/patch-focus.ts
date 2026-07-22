/**
 * Storybook 10.5 instruments HTMLElement.prototype.focus as a getter that
 * touches `this.ownerDocument`. Docs (react-aria) reads focus off the
 * prototype and throws `TypeError: Illegal invocation`.
 * @see https://github.com/storybookjs/storybook/issues/35503
 */
export function patchStorybookFocusInstrumentation() {
    if (typeof HTMLElement === 'undefined') {
        return
    }

    const descriptor = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'focus')
    if (!descriptor?.get || typeof descriptor.value === 'function') {
        return
    }

    const probe = document.createElement('button')
    let instrumentedFocus: typeof HTMLElement.prototype.focus

    try {
        instrumentedFocus = descriptor.get.call(probe)
    } catch {
        return
    }

    if (typeof instrumentedFocus !== 'function') {
        return
    }

    Object.defineProperty(HTMLElement.prototype, 'focus', {
        configurable: true,
        writable: true,
        enumerable: true,
        value: function focus(this: HTMLElement, options?: FocusOptions) {
            return instrumentedFocus.call(this, options)
        },
    })
}
