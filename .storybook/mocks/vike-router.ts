export async function navigate(href: string) {
    console.info('[storybook] navigate:', href)
}

export function reload() {
    console.info('[storybook] reload')
}

export function prefetch(_href: string) {
    console.info('[storybook] prefetch')
}
