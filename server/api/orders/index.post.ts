import { eq, inArray } from 'drizzle-orm'
import { useDb, schema } from '../../database/client'
import { requireUser } from '../../utils/session'

const RESTAURANT = {
    deliveryFee: 199,
    freeDeliveryFrom: 1500,
}

interface OrderItemInput {
    productId: string
    quantity: number
}

interface CreateOrderBody {
    items?: OrderItemInput[]
    fulfillment?: 'pickup' | 'delivery'
    address?: string | null
    comment?: string
}

function calcDeliveryFee(subtotal: number, fulfillment: 'pickup' | 'delivery') {
    if (fulfillment === 'pickup') {
        return 0
    }
    if (subtotal >= RESTAURANT.freeDeliveryFrom) {
        return 0
    }
    return RESTAURANT.deliveryFee
}

export default defineEventHandler(async (event) => {
    const user = await requireUser(event)
    const body = await readBody<CreateOrderBody>(event)

    if (!body.items?.length) {
        throw createError({ statusCode: 400, statusMessage: 'Cart is empty' })
    }

    if (body.fulfillment !== 'pickup' && body.fulfillment !== 'delivery') {
        throw createError({ statusCode: 400, statusMessage: 'Invalid fulfillment type' })
    }

    if (body.fulfillment === 'delivery' && (!body.address || body.address.trim().length < 5)) {
        throw createError({ statusCode: 400, statusMessage: 'Delivery address is required' })
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
            throw createError({
                statusCode: 400,
                statusMessage: `Product not found: ${item.productId}`,
            })
        }

        if (item.quantity <= 0) {
            throw createError({ statusCode: 400, statusMessage: 'Invalid quantity' })
        }

        return {
            product,
            quantity: item.quantity,
        }
    })

    const subtotal = orderLines.reduce(
        (sum, line) => sum + line.product.price * line.quantity,
        0,
    )
    const deliveryFee = calcDeliveryFee(subtotal, body.fulfillment)
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
        throw createError({ statusCode: 500, statusMessage: 'Failed to create order' })
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

    return {
        order: {
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
        },
    }
})
