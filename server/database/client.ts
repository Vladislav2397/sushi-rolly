import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema'

let client: ReturnType<typeof postgres> | null = null
let db: ReturnType<typeof drizzle<typeof schema>> | null = null

export function useDb() {
    if (!db) {
        const url = process.env.DATABASE_URL

        if (!url) {
            throw new Error('DATABASE_URL is not configured')
        }

        client = postgres(url, { max: 10 })
        db = drizzle(client, { schema })
    }

    return db
}

export { schema }
