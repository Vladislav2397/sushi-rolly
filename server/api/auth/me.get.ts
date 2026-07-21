import { getCurrentUser, mapUser } from '../../utils/session'

export default defineEventHandler(async (event) => {
    const user = await getCurrentUser(event)
    return { user: user ? mapUser(user) : null }
})
