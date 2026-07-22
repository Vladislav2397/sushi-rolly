export function formatPrice(value: number): string {
    return new Intl.NumberFormat('ru-RU', {
        style: 'currency',
        currency: 'RUB',
        maximumFractionDigits: 0,
    }).format(value)
}

export function formatPhone(raw: string): string {
    const digits = raw.replace(/\D/g, '')

    if (digits.length === 11 && (digits.startsWith('7') || digits.startsWith('8'))) {
        const n = digits.slice(1)
        return `+7 (${n.slice(0, 3)}) ${n.slice(3, 6)}-${n.slice(6, 8)}-${n.slice(8, 10)}`
    }

    if (digits.length === 10) {
        return `+7 (${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 8)}-${digits.slice(8, 10)}`
    }

    return raw
}

export function normalizePhone(raw: string): string {
    const digits = raw.replace(/\D/g, '')

    if (digits.length === 11 && digits.startsWith('8')) {
        return `7${digits.slice(1)}`
    }

    if (digits.length === 11 && digits.startsWith('7')) {
        return digits
    }

    if (digits.length === 10) {
        return `7${digits}`
    }

    return digits
}

export function isValidPhone(raw: string): boolean {
    return normalizePhone(raw).length === 11
}

export function formatDateTime(iso: string): string {
    return new Intl.DateTimeFormat('ru-RU', {
        day: 'numeric',
        month: 'long',
        hour: '2-digit',
        minute: '2-digit',
    }).format(new Date(iso))
}
