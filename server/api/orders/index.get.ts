import { desc, eq } from 'drizzle-orm'
import { useDb, schema } from '../../database/client'
import { requireUser } from '../../utils/session'

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

export default defineEventHandler(async (event) => {
    const user = await requireUser(event)
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

    return { orders: result }
})
