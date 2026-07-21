import {
    integer,
    jsonb,
    pgEnum,
    pgTable,
    text,
    timestamp,
    uuid,
    varchar,
} from 'drizzle-orm/pg-core'

export const menuCategoryEnum = pgEnum('menu_category', ['set', 'sushi', 'roll', 'drink'])
export const orderStatusEnum = pgEnum('order_status', [
    'new',
    'cooking',
    'on_the_way',
    'ready',
    'done',
])
export const fulfillmentEnum = pgEnum('fulfillment', ['pickup', 'delivery'])

export const users = pgTable('users', {
    id: uuid('id').primaryKey().defaultRandom(),
    phone: varchar('phone', { length: 11 }).notNull().unique(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
})

export const authCodes = pgTable('auth_codes', {
    id: uuid('id').primaryKey().defaultRandom(),
    phone: varchar('phone', { length: 11 }).notNull(),
    code: varchar('code', { length: 6 }).notNull(),
    expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
})

export const sessions = pgTable('sessions', {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
        .notNull()
        .references(() => users.id, { onDelete: 'cascade' }),
    token: varchar('token', { length: 64 }).notNull().unique(),
    expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
})

export const admins = pgTable('admins', {
    id: uuid('id').primaryKey().defaultRandom(),
    email: varchar('email', { length: 255 }).notNull().unique(),
    passwordHash: text('password_hash').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
})

export const adminSessions = pgTable('admin_sessions', {
    id: uuid('id').primaryKey().defaultRandom(),
    adminId: uuid('admin_id')
        .notNull()
        .references(() => admins.id, { onDelete: 'cascade' }),
    token: varchar('token', { length: 64 }).notNull().unique(),
    expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
})

export const menuItems = pgTable('menu_items', {
    id: varchar('id', { length: 32 }).primaryKey(),
    category: menuCategoryEnum('category').notNull(),
    title: varchar('title', { length: 255 }).notNull(),
    description: text('description').notNull(),
    price: integer('price').notNull(),
    pieces: integer('pieces'),
    weight: integer('weight'),
    volume: integer('volume'),
    number: integer('number'),
    accent: varchar('accent', { length: 16 }),
    tags: jsonb('tags').$type<string[]>().notNull().default([]),
    sortOrder: integer('sort_order').notNull().default(0),
})

export const orders = pgTable('orders', {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
        .notNull()
        .references(() => users.id),
    phone: varchar('phone', { length: 11 }).notNull(),
    fulfillment: fulfillmentEnum('fulfillment').notNull(),
    address: text('address'),
    comment: text('comment').notNull().default(''),
    subtotal: integer('subtotal').notNull(),
    deliveryFee: integer('delivery_fee').notNull(),
    total: integer('total').notNull(),
    status: orderStatusEnum('status').notNull().default('new'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
})

export const orderItems = pgTable('order_items', {
    id: uuid('id').primaryKey().defaultRandom(),
    orderId: uuid('order_id')
        .notNull()
        .references(() => orders.id, { onDelete: 'cascade' }),
    productId: varchar('product_id', { length: 32 }).notNull(),
    category: menuCategoryEnum('category').notNull(),
    title: varchar('title', { length: 255 }).notNull(),
    price: integer('price').notNull(),
    quantity: integer('quantity').notNull(),
    number: integer('number'),
})

export type DbUser = typeof users.$inferSelect
export type DbAdmin = typeof admins.$inferSelect
export type DbMenuItem = typeof menuItems.$inferSelect
export type DbOrder = typeof orders.$inferSelect
export type DbOrderItem = typeof orderItems.$inferSelect
