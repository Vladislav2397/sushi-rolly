import 'dotenv/config'
import bcrypt from 'bcryptjs'
import { eq } from 'drizzle-orm'
import { createStandaloneDb } from './standalone'
import { admins } from './schema'

async function seedAdmin() {
    const email = process.env.ADMIN_EMAIL || 'admin@sushi-rolly.local'
    const password = process.env.ADMIN_PASSWORD || 'admin1234'

    const { db, client } = createStandaloneDb()
    const passwordHash = await bcrypt.hash(password, 10)

    const [existing] = await db.select().from(admins).where(eq(admins.email, email)).limit(1)

    if (existing) {
        await db
            .update(admins)
            .set({ passwordHash })
            .where(eq(admins.id, existing.id))
        console.log(`Admin updated: ${email}`)
    } else {
        await db.insert(admins).values({ email, passwordHash })
        console.log(`Admin created: ${email}`)
    }

    await client.end()
}

seedAdmin().catch((error) => {
    console.error(error)
    process.exit(1)
})
