import { sql } from 'drizzle-orm'
import {
	index,
	pgTableCreator,
	timestamp,
	varchar,
	decimal,
	uuid
} from 'drizzle-orm/pg-core'
import { randomUUID } from 'crypto'

export const createTable = pgTableCreator(name => `tracky_${name}`)

export const food = createTable(
	'food',
	{
		id: uuid('id').primaryKey().default(randomUUID()),
		name: varchar('name', { length: 256 }).notNull(),
		protein: decimal('protein', { precision: 5, scale: 2 }).notNull(),
		kcal: decimal('kcal', { precision: 5, scale: 2 }).notNull(),
		fat: decimal('fat', { precision: 5, scale: 2 }).notNull(),
		carbs: decimal('carbs', { precision: 5, scale: 2 }).notNull(),
		servingSize: decimal('serving_size', { precision: 5, scale: 2 }).notNull(),
		unit: varchar('unit', { length: 16 }).notNull(),
		createdAt: timestamp('created_at', { withTimezone: true })
			.default(sql`CURRENT_TIMESTAMP`)
			.notNull(),
		updatedAt: timestamp('updatedAt', { withTimezone: true })
	},
	food => ({
		nameIndex: index('name_idx').on(food.name)
	})
)

export const consumption = createTable(
	'consumption',
	{
		id: uuid('id').primaryKey().default(randomUUID()),
		userId: varchar('user_id', { length: 50 }).notNull(),
		foodId: uuid('food_id')
			.references(() => food.id)
			.notNull(),
		portion: decimal('serving_size', { precision: 5, scale: 2 }).notNull(),
		unit: varchar('unit', { length: 16 }).notNull(),
		createdAt: timestamp('created_at', { withTimezone: true })
			.default(sql`CURRENT_TIMESTAMP`)
			.notNull(),
		updatedAt: timestamp('updatedAt', { withTimezone: true })
	},
	consumption => ({
		userIndex: index('user_idx').on(consumption.userId),
		foodIndex: index('food_idx').on(consumption.foodId)
	})
)
