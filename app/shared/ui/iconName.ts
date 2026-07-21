export function toIconifyName(name?: string | null): string | undefined {
    if (!name) {
        return undefined
    }

    if (name.startsWith('i-lucide-')) {
        return `lucide:${name.slice('i-lucide-'.length)}`
    }

    if (name.includes(':')) {
        return name
    }

    return name
}
