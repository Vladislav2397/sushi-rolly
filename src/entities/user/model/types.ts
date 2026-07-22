export interface User {
    id: string
    phone: string
    createdAt: string
}

export interface AuthSession {
    user: User | null
    pendingPhone: string | null
}
