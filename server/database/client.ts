import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema'

let client: ReturnType<typeof postgres> | null = null
let db: ReturnType<typeof drizzle<typeof schema>> | null = null

export function useDb() {
    if (!db) {
        const config = useRuntimeConfig()
        const url = config.databaseUrl as string

        if (!url) {
            throw createError({
                statusCode: 500,
                statusMessage: 'DATABASE_URL is not configured',
            })
        }

        client = postgres(url, { max: 10 })
        db = drizzle(client, { schema })
    }

    return db
}

export { schema }
