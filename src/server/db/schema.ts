import { sql } from 'drizzle-orm'
import {
	index,
	pgTableCreator,
	timestamp,
	varchar,
	decimal,
	uuid,
	pgEnum
} from 'drizzle-orm/pg-core'

export const unitEnum = pgEnum('unit', ['g', 'ml', 'oz', 'cup'])
export const createTable = pgTableCreator(name => `tracky_${name}`)

export const food = createTable(
	'food',
	{
		id: uuid('id')
			.primaryKey()
			.default(sql`gen_random_uuid()`),
		name: varchar('name', { length: 256 }).notNull(),
		protein: decimal('protein', { precision: 5, scale: 2 }).notNull(),
		kcal: decimal('kcal', { precision: 5, scale: 2 }).notNull(),
		fat: decimal('fat', { precision: 5, scale: 2 }).notNull(),
		carbs: decimal('carbs', { precision: 5, scale: 2 }).notNull(),
		servingSize: decimal('serving_size', { precision: 5, scale: 2 }).notNull(),
		unit: unitEnum('unit').notNull(),
		createdAt: timestamp('created_at', { withTimezone: true })
			.default(sql`CURRENT_TIMESTAMP`)
			.notNull(),
		updatedAt: timestamp('updatedAt', { withTimezone: true })
	},
	food => ({
		nameIndex: index('food_name_idx').on(food.name)
	})
)

export const consumption = createTable(
	'consumption',
	{
		id: uuid('id')
			.primaryKey()
			.default(sql`gen_random_uuid()`),
		userId: varchar('user_id', { length: 50 }).notNull(),
		foodId: uuid('food_id')
			.references(() => food.id)
			.notNull(),
		portion: decimal('serving_size', { precision: 5, scale: 2 }).notNull(),
		unit: unitEnum('unit').notNull(),
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

export const exerciseCategory = createTable(
	'exercise_category',
	{
		id: uuid('id')
			.primaryKey()
			.default(sql`gen_random_uuid()`),
		name: varchar('name', { length: 50 }).notNull(),
		label: varchar('label', { length: 50 }).notNull(),
		createdAt: timestamp('created_at', { withTimezone: true })
			.default(sql`CURRENT_TIMESTAMP`)
			.notNull(),
		updatedAt: timestamp('updatedAt', { withTimezone: true })
	},
	exerciseCategory => ({
		nameIndex: index('exercise_cat_name_idx').on(exerciseCategory.name)
	})
)

const effortEnum = pgEnum('effort', ['easy', 'moderate', 'hard', 'very-hard'])

export const exercise = createTable(
	'exercise',
	{
		id: uuid('id')
			.primaryKey()
			.default(sql`gen_random_uuid()`),
		duration: decimal('duration', { precision: 5, scale: 2 }).notNull(),
		effort: effortEnum('effort').notNull(),
		energyBurned: decimal('energy_burned', {
			precision: 5,
			scale: 2
		}).notNull(),
		categoryId: uuid('category_id')
			.references(() => exerciseCategory.id)
			.notNull(),
		createdAt: timestamp('created_at', { withTimezone: true })
			.default(sql`CURRENT_TIMESTAMP`)
			.notNull(),
		updatedAt: timestamp('updatedAt', { withTimezone: true })
	},
	exercise => ({
		nameIndex: index('categoryId_idx').on(exercise.categoryId)
	})
)
