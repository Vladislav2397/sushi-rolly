export function uid(prefix = 'id'): string {
    return `${prefix}_${Math.random().toString(36).slice(2, 10)}_${Date.now().toString(36)}`
}

export function readStorage<T>(key: string, fallback: T): T {
    if (!import.meta.client) {
        return fallback
    }

    try {
        const raw = localStorage.getItem(key)
        if (!raw) {
            return fallback
        }
        return JSON.parse(raw) as T
    } catch {
        return fallback
    }
}

export function writeStorage<T>(key: string, value: T): void {
    if (!import.meta.client) {
        return
    }

    localStorage.setItem(key, JSON.stringify(value))
}

export function removeStorage(key: string): void {
    if (!import.meta.client) {
        return
    }

    localStorage.removeItem(key)
}
