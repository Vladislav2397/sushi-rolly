import { Hono } from 'hono'
import { HTTPException } from 'hono/http-exception'
import bcrypt from 'bcryptjs'
import { asc, desc, eq } from 'drizzle-orm'
import { useDb, schema } from '../../database/client'
import {
    clearAdminSessionCookie,
    createAdminSessionToken,
    getAdminSessionExpiry,
    getAdminSessionToken,
    getCurrentAdmin,
    mapAdmin,
    requireAdmin,
    setAdminSessionCookie,
} from '../../utils/admin-auth'

const ORDER_STATUSES = ['new', 'cooking', 'on_the_way', 'ready', 'done'] as const
const MENU_CATEGORIES = ['set', 'sushi', 'roll', 'drink'] as const

export const adminApi = new Hono()

adminApi.onError((err, c) => {
    if (err instanceof HTTPException) {
        return c.json({ statusMessage: err.message }, err.status)
    }

    console.error(err)
    return c.json({ statusMessage: 'Internal Server Error' }, 500)
})

adminApi.post('/auth/login', async (c) => {
    const body = await c.req.json<{ email?: string; password?: string }>()
    const email = body.email?.trim().toLowerCase()
    const password = body.password

    if (!email || !password) {
        throw new HTTPException(400, { message: 'Email and password are required' })
    }

    const db = useDb()
    const [admin] = await db.select().from(schema.admins).where(eq(schema.admins.email, email)).limit(1)

    if (!admin || !(await bcrypt.compare(password, admin.passwordHash))) {
        throw new HTTPException(401, { message: 'Invalid email or password' })
    }

    const token = createAdminSessionToken()
    const expiresAt = getAdminSessionExpiry()

    await db.insert(schema.adminSessions).values({
        adminId: admin.id,
        token,
        expiresAt,
    })

    setAdminSessionCookie(c, token, expiresAt)

    return c.json({ admin: mapAdmin(admin) })
})

adminApi.post('/auth/logout', async (c) => {
    const token = getAdminSessionToken(c)

    if (token) {
        const db = useDb()
        await db.delete(schema.adminSessions).where(eq(schema.adminSessions.token, token))
    }

    clearAdminSessionCookie(c)
    return c.json({ ok: true })
})

adminApi.get('/auth/me', async (c) => {
    const admin = await getCurrentAdmin(c)
    return c.json({ admin: admin ? mapAdmin(admin) : null })
})

function mapOrder(
    order: typeof schema.orders.$inferSelect,
    items: (typeof schema.orderItems.$inferSelect)[],
) {
    return {
        id: order.id,
        userId: order.userId,
        phone: order.phone,
        fulfillment: order.fulfillment,
        address: order.address,
        comment: order.comment,
        subtotal: order.subtotal,
        deliveryFee: order.deliveryFee,
        total: order.total,
        status: order.status,
        createdAt: order.createdAt.toISOString(),
        items: items.map((item) => ({
            productId: item.productId,
            category: item.category,
            title: item.title,
            price: item.price,
            quantity: item.quantity,
            ...(item.number != null ? { number: item.number } : {}),
        })),
    }
}

adminApi.get('/orders', async (c) => {
    await requireAdmin(c)
    const db = useDb()

    const rows = await db.select().from(schema.orders).orderBy(desc(schema.orders.createdAt))
    const result = []

    for (const order of rows) {
        const items = await db
            .select()
            .from(schema.orderItems)
            .where(eq(schema.orderItems.orderId, order.id))
        result.push(mapOrder(order, items))
    }

    return c.json({ orders: result })
})

adminApi.patch('/orders/:id', async (c) => {
    await requireAdmin(c)
    const id = c.req.param('id')
    const body = await c.req.json<{ status?: string }>()

    if (!body.status || !ORDER_STATUSES.includes(body.status as (typeof ORDER_STATUSES)[number])) {
        throw new HTTPException(400, { message: 'Invalid status' })
    }

    const db = useDb()
    const [order] = await db
        .update(schema.orders)
        .set({ status: body.status as (typeof ORDER_STATUSES)[number] })
        .where(eq(schema.orders.id, id))
        .returning()

    if (!order) {
        throw new HTTPException(404, { message: 'Order not found' })
    }

    const items = await db
        .select()
        .from(schema.orderItems)
        .where(eq(schema.orderItems.orderId, order.id))

    return c.json({ order: mapOrder(order, items) })
})

function mapMenuItem(item: typeof schema.menuItems.$inferSelect) {
    return {
        id: item.id,
        category: item.category,
        title: item.title,
        description: item.description,
        price: item.price,
        pieces: item.pieces,
        weight: item.weight,
        volume: item.volume,
        number: item.number,
        accent: item.accent,
        tags: item.tags,
        sortOrder: item.sortOrder,
    }
}

adminApi.get('/menu', async (c) => {
    await requireAdmin(c)
    const db = useDb()
    const items = await db
        .select()
        .from(schema.menuItems)
        .orderBy(asc(schema.menuItems.sortOrder), asc(schema.menuItems.title))

    return c.json({ items: items.map(mapMenuItem) })
})

type MenuBody = {
    id?: string
    category?: string
    title?: string
    description?: string
    price?: number
    pieces?: number | null
    weight?: number | null
    volume?: number | null
    number?: number | null
    accent?: string | null
    tags?: string[]
    sortOrder?: number
}

function parseMenuBody(body: MenuBody, requireId: boolean) {
    if (requireId && !body.id?.trim()) {
        throw new HTTPException(400, { message: 'id is required' })
    }

    if (!body.category || !MENU_CATEGORIES.includes(body.category as (typeof MENU_CATEGORIES)[number])) {
        throw new HTTPException(400, { message: 'Invalid category' })
    }

    if (!body.title?.trim() || !body.description?.trim()) {
        throw new HTTPException(400, { message: 'title and description are required' })
    }

    if (typeof body.price !== 'number' || body.price < 0) {
        throw new HTTPException(400, { message: 'Invalid price' })
    }

    return {
        id: body.id?.trim(),
        category: body.category as (typeof MENU_CATEGORIES)[number],
        title: body.title.trim(),
        description: body.description.trim(),
        price: Math.round(body.price),
        pieces: body.pieces ?? null,
        weight: body.weight ?? null,
        volume: body.volume ?? null,
        number: body.number ?? null,
        accent: body.accent ?? null,
        tags: Array.isArray(body.tags) ? body.tags : [],
        sortOrder: typeof body.sortOrder === 'number' ? body.sortOrder : 0,
    }
}

adminApi.post('/menu', async (c) => {
    await requireAdmin(c)
    const parsed = parseMenuBody(await c.req.json<MenuBody>(), true)
    const db = useDb()

    try {
        const [item] = await db
            .insert(schema.menuItems)
            .values({
                id: parsed.id!,
                category: parsed.category,
                title: parsed.title,
                description: parsed.description,
                price: parsed.price,
                pieces: parsed.pieces,
                weight: parsed.weight,
                volume: parsed.volume,
                number: parsed.number,
                accent: parsed.accent,
                tags: parsed.tags,
                sortOrder: parsed.sortOrder,
            })
            .returning()

        return c.json({ item: mapMenuItem(item!) }, 201)
    } catch {
        throw new HTTPException(400, { message: 'Failed to create menu item (id may already exist)' })
    }
})

adminApi.put('/menu/:id', async (c) => {
    await requireAdmin(c)
    const id = c.req.param('id')
    const parsed = parseMenuBody({ ...(await c.req.json<MenuBody>()), id }, true)
    const db = useDb()

    const [item] = await db
        .update(schema.menuItems)
        .set({
            category: parsed.category,
            title: parsed.title,
            description: parsed.description,
            price: parsed.price,
            pieces: parsed.pieces,
            weight: parsed.weight,
            volume: parsed.volume,
            number: parsed.number,
            accent: parsed.accent,
            tags: parsed.tags,
            sortOrder: parsed.sortOrder,
        })
        .where(eq(schema.menuItems.id, id))
        .returning()

    if (!item) {
        throw new HTTPException(404, { message: 'Menu item not found' })
    }

    return c.json({ item: mapMenuItem(item) })
})

adminApi.delete('/menu/:id', async (c) => {
    await requireAdmin(c)
    const id = c.req.param('id')
    const db = useDb()

    const [item] = await db.delete(schema.menuItems).where(eq(schema.menuItems.id, id)).returning()

    if (!item) {
        throw new HTTPException(404, { message: 'Menu item not found' })
    }

    return c.json({ ok: true })
})

adminApi.get('/users', async (c) => {
    await requireAdmin(c)
    const db = useDb()
    const rows = await db.select().from(schema.users).orderBy(desc(schema.users.createdAt))

    return c.json({
        users: rows.map((user) => ({
            id: user.id,
            phone: user.phone,
            createdAt: user.createdAt.toISOString(),
        })),
    })
})
