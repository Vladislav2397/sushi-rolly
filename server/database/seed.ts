import 'dotenv/config'
import {
    MENU_DRINKS,
    MENU_ROLLS,
    MENU_SETS,
    MENU_SUSHI,
} from '../../src/entities/menu/model/menu-data'
import type { MenuProduct, MenuSet } from '../../src/entities/menu/model/types'
import { createStandaloneDb } from './standalone'
import { menuItems } from './schema'

function mapSet(item: MenuSet, sortOrder: number) {
    return {
        id: item.id,
        category: item.category,
        title: item.title,
        description: item.description,
        price: item.price,
        pieces: item.pieces,
        weight: item.weight,
        volume: null,
        number: item.number,
        accent: item.accent,
        tags: item.tags,
        sortOrder,
    }
}

function mapProduct(item: MenuProduct, sortOrder: number) {
    return {
        id: item.id,
        category: item.category,
        title: item.title,
        description: item.description,
        price: item.price,
        pieces: item.pieces ?? null,
        weight: item.weight ?? null,
        volume: item.volume ?? null,
        number: null,
        accent: null,
        tags: item.tags,
        sortOrder,
    }
}

async function seed() {
    const { db, client } = createStandaloneDb()

    const rows = [
        ...MENU_SETS.map((item, index) => mapSet(item, index)),
        ...MENU_SUSHI.map((item, index) => mapProduct(item, index)),
        ...MENU_ROLLS.map((item, index) => mapProduct(item, index)),
        ...MENU_DRINKS.map((item, index) => mapProduct(item, index)),
    ]

    for (const row of rows) {
        await db
            .insert(menuItems)
            .values(row)
            .onConflictDoUpdate({
                target: menuItems.id,
                set: {
                    category: row.category,
                    title: row.title,
                    description: row.description,
                    price: row.price,
                    pieces: row.pieces,
                    weight: row.weight,
                    volume: row.volume,
                    number: row.number,
                    accent: row.accent,
                    tags: row.tags,
                    sortOrder: row.sortOrder,
                },
            })
    }

    const existing = await db.select({ id: menuItems.id }).from(menuItems)
    console.log(`Menu seeded: ${existing.length} items`)

    await client.end()
}

seed().catch((error) => {
    console.error(error)
    process.exit(1)
})
