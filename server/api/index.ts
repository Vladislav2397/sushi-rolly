import { Hono } from 'hono'
import { HTTPException } from 'hono/http-exception'
import { and, asc, desc, eq, gt, inArray } from 'drizzle-orm'
import { useDb, schema } from '../database/client'
import {
    clearSessionCookie,
    createSessionToken,
    getAuthCodeExpiry,
    getSessionExpiry,
    getSessionToken,
    isValidPhone,
    normalizePhone,
    setSessionCookie,
} from '../utils/auth'
import { getCurrentUser, mapUser, requireUser } from '../utils/session'

const RESTAURANT = {
    deliveryFee: 199,
    freeDeliveryFrom: 1500,
}

export const api = new Hono()

api.onError((err, c) => {
    if (err instanceof HTTPException) {
        return c.json({ statusMessage: err.message }, err.status)
    }

    console.error(err)
    return c.json({ statusMessage: 'Internal Server Error' }, 500)
})

api.post('/auth/request-code', async (c) => {
    const body = await c.req.json<{ phone?: string }>()

    if (!body.phone || !isValidPhone(body.phone)) {
        throw new HTTPException(400, { message: 'Invalid phone number' })
    }

    const phone = normalizePhone(body.phone)
    const code = String(process.env.DEMO_OTP_CODE || '1234')
    const db = useDb()

    await db.delete(schema.authCodes).where(eq(schema.authCodes.phone, phone))
    await db.insert(schema.authCodes).values({
        phone,
        code,
        expiresAt: getAuthCodeExpiry(),
    })

    return c.json({ ok: true })
})

api.post('/auth/verify-code', async (c) => {
    const body = await c.req.json<{ phone?: string; code?: string }>()

    if (!body.phone || !isValidPhone(body.phone)) {
        throw new HTTPException(400, { message: 'Invalid phone number' })
    }

    if (!body.code || body.code.length !== 4) {
        throw new HTTPException(400, { message: 'Invalid code' })
    }

    const phone = normalizePhone(body.phone)
    const db = useDb()
    const now = new Date()

    const [authCode] = await db
        .select()
        .from(schema.authCodes)
        .where(
            and(
                eq(schema.authCodes.phone, phone),
                eq(schema.authCodes.code, body.code),
                gt(schema.authCodes.expiresAt, now),
            ),
        )
        .limit(1)

    if (!authCode) {
        throw new HTTPException(401, { message: 'Invalid or expired code' })
    }

    await db.delete(schema.authCodes).where(eq(schema.authCodes.phone, phone))

    let [user] = await db.select().from(schema.users).where(eq(schema.users.phone, phone)).limit(1)

    if (!user) {
        const [created] = await db.insert(schema.users).values({ phone }).returning()
        if (!created) {
            throw new HTTPException(500, { message: 'Failed to create user' })
        }
        user = created
    }

    const token = createSessionToken()
    const expiresAt = getSessionExpiry()

    await db.insert(schema.sessions).values({
        userId: user.id,
        token,
        expiresAt,
    })

    setSessionCookie(c, token, expiresAt)

    return c.json({ user: mapUser(user) })
})

api.post('/auth/logout', async (c) => {
    const token = getSessionToken(c)

    if (token) {
        const db = useDb()
        await db.delete(schema.sessions).where(eq(schema.sessions.token, token))
    }

    clearSessionCookie(c)
    return c.json({ ok: true })
})

api.get('/auth/me', async (c) => {
    const user = await getCurrentUser(c)
    return c.json({ user: user ? mapUser(user) : null })
})

api.get('/menu', async (c) => {
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

    return c.json({
        sets: sets.map(mapItem),
        sushi: sushi.map(mapItem),
        rolls: rolls.map(mapItem),
        drinks: drinks.map(mapItem),
    })
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

api.get('/orders', async (c) => {
    const user = await requireUser(c)
    const db = useDb()

    const userOrders = await db
        .select()
        .from(schema.orders)
        .where(eq(schema.orders.userId, user.id))
        .orderBy(desc(schema.orders.createdAt))

    const result = []

    for (const order of userOrders) {
        const items = await db
            .select()
            .from(schema.orderItems)
            .where(eq(schema.orderItems.orderId, order.id))

        result.push(mapOrder(order, items))
    }

    return c.json({ orders: result })
})

api.post('/orders', async (c) => {
    const user = await requireUser(c)
    const body = await c.req.json<{
        items?: { productId: string; quantity: number }[]
        fulfillment?: 'pickup' | 'delivery'
        address?: string | null
        comment?: string
    }>()

    if (!body.items?.length) {
        throw new HTTPException(400, { message: 'Cart is empty' })
    }

    if (body.fulfillment !== 'pickup' && body.fulfillment !== 'delivery') {
        throw new HTTPException(400, { message: 'Invalid fulfillment type' })
    }

    if (body.fulfillment === 'delivery' && (!body.address || body.address.trim().length < 5)) {
        throw new HTTPException(400, { message: 'Delivery address is required' })
    }

    const db = useDb()
    const productIds = body.items.map((item) => item.productId)

    const menuRows = await db
        .select()
        .from(schema.menuItems)
        .where(inArray(schema.menuItems.id, productIds))

    const menuMap = new Map(menuRows.map((row) => [row.id, row]))

    const orderLines = body.items.map((item) => {
        const product = menuMap.get(item.productId)

        if (!product) {
            throw new HTTPException(400, { message: `Product not found: ${item.productId}` })
        }

        if (item.quantity <= 0) {
            throw new HTTPException(400, { message: 'Invalid quantity' })
        }

        return { product, quantity: item.quantity }
    })

    const subtotal = orderLines.reduce(
        (sum, line) => sum + line.product.price * line.quantity,
        0,
    )
    const deliveryFee =
        body.fulfillment === 'pickup' || subtotal >= RESTAURANT.freeDeliveryFrom
            ? 0
            : RESTAURANT.deliveryFee
    const total = subtotal + deliveryFee

    const [order] = await db
        .insert(schema.orders)
        .values({
            userId: user.id,
            phone: user.phone,
            fulfillment: body.fulfillment,
            address: body.fulfillment === 'delivery' ? body.address!.trim() : null,
            comment: body.comment?.trim() ?? '',
            subtotal,
            deliveryFee,
            total,
            status: 'new',
        })
        .returning()

    if (!order) {
        throw new HTTPException(500, { message: 'Failed to create order' })
    }

    await db.insert(schema.orderItems).values(
        orderLines.map(({ product, quantity }) => ({
            orderId: order.id,
            productId: product.id,
            category: product.category,
            title: product.title,
            price: product.price,
            quantity,
            number: product.number,
        })),
    )

    const items = await db
        .select()
        .from(schema.orderItems)
        .where(eq(schema.orderItems.orderId, order.id))

    return c.json({ order: mapOrder(order, items) })
})
