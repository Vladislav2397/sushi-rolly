import type { ApiUser } from '@shared/api'

export type User = ApiUser

export interface AuthSession {
    user: User | null
    pendingPhone: string | null
}
