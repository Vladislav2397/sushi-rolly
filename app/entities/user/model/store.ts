import type { User } from './types'
import {
    DEMO_OTP_CODE,
    normalizePhone,
    readStorage,
    removeStorage,
    uid,
    writeStorage,
} from '@shared'

const STORAGE_KEY = 'sushi-rolly:user'

export function useUserStore() {
    const user = useState<User | null>('user', () => null)
    const pendingPhone = useState<string | null>('auth-pending-phone', () => null)

    const isAuthenticated = computed(() => Boolean(user.value))

    function hydrate() {
        user.value = readStorage<User | null>(STORAGE_KEY, null)
    }

    function requestCode(phone: string) {
        pendingPhone.value = normalizePhone(phone)
        return { ok: true as const }
    }

    function verifyCode(code: string) {
        if (!pendingPhone.value) {
            return { ok: false as const, error: 'Сначала укажите номер телефона' }
        }

        if (code !== DEMO_OTP_CODE) {
            return { ok: false as const, error: 'Неверный код. Для демо используйте 1234' }
        }

        const nextUser: User = {
            id: uid('user'),
            phone: pendingPhone.value,
            createdAt: new Date().toISOString(),
        }

        user.value = nextUser
        pendingPhone.value = null
        writeStorage(STORAGE_KEY, nextUser)

        return { ok: true as const }
    }

    function logout() {
        user.value = null
        pendingPhone.value = null
        removeStorage(STORAGE_KEY)
    }

    return {
        user,
        pendingPhone,
        isAuthenticated,
        hydrate,
        requestCode,
        verifyCode,
        logout,
    }
}
