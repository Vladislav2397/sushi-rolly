export { data }
export type Data = Awaited<ReturnType<typeof data>>

import type { PageContextServer } from 'vike/types'
import { asc } from 'drizzle-orm'
import type { ApiMenuResponse } from '../../app/shared/api/types'
import { useDb, schema } from '../../server/database/client'

async function data(_pageContext: PageContextServer): Promise<{ menu: ApiMenuResponse | null }> {
    try {
        const db = useDb()
        const items = await db
            .select()
            .from(schema.menuItems)
            .orderBy(asc(schema.menuItems.sortOrder))

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

        const sets = items.filter((item) => item.category === 'set').map(mapItem)
        const sushi = items.filter((item) => item.category === 'sushi').map(mapItem)
        const rolls = items.filter((item) => item.category === 'roll').map(mapItem)
        const drinks = items.filter((item) => item.category === 'drink').map(mapItem)

        return {
            menu: {
                sets,
                sushi,
                rolls,
                drinks,
            } as ApiMenuResponse,
        }
    } catch {
        return { menu: null }
    }
}
