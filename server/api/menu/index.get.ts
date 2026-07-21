import { asc } from 'drizzle-orm'
import { useDb, schema } from '../../database/client'

export default defineEventHandler(async () => {
    const db = useDb()
    const items = await db
        .select()
        .from(schema.menuItems)
        .orderBy(asc(schema.menuItems.sortOrder))

    const sets = items.filter((item) => item.category === 'set')
    const sushi = items.filter((item) => item.category === 'sushi')
    const rolls = items.filter((item) => item.category === 'roll')
    const drinks = items.filter((item) => item.category === 'drink')

    function mapItem(item: (typeof items)[number]) {
        return {
            id: item.id,
            category: item.category,
            title: item.title,
            description: item.description,
            price: item.price,
            tags: item.tags,
            ...(item.pieces != null ? { pieces: item.pieces } : {}),
            ...(item.weight != null ? { weight: item.weight } : {}),
            ...(item.volume != null ? { volume: item.volume } : {}),
            ...(item.number != null ? { number: item.number } : {}),
            ...(item.accent ? { accent: item.accent } : {}),
        }
    }

    return {
        sets: sets.map(mapItem),
        sushi: sushi.map(mapItem),
        rolls: rolls.map(mapItem),
        drinks: drinks.map(mapItem),
    }
})
