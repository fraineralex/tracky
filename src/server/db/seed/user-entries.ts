import { EFFORT_LEVELS } from '~/constants'
import { db } from '..'
import {
	consumption,
	unitEnum,
	diaryGroupEnum,
	exercise,
	food,
	exerciseCategory
} from '../schema'
import { eq, or } from 'drizzle-orm'
import { env } from '~/env'

const CLERK_USER_ID = env.CLERK_USER_ID

export async function seedUserEntries() {
	if (!CLERK_USER_ID) {
		console.error(
			'If you want to seed user entries, please provide a Clerk userId in your .env file'
		)
		return
	}

	const foodSelect = await db
		.select({ id: food.id, name: food.name })
		.from(food)
		.where(
			or(
				eq(food.name, 'Whey Protein Powder, 24 Grams of Protein per Scoop'),
				eq(food.name, 'Flour, coconut'),
				eq(food.name, 'Olive Oil')
			)
		)

	if (foodSelect.length < 3) {
		console.error(
			'You have to import all the food items before seed the database with user consumptions'
		)
		return
	}

	const consumtions: {
		foodId: string
		mealGroup: (typeof diaryGroupEnum.enumValues)[number]
		portion: string
		unit: (typeof unitEnum.enumValues)[number]
		userId: string
	}[] = [
		{
			foodId:
				foodSelect.find(
					f => f.name === 'Whey Protein Powder, 24 Grams of Protein per Scoop'
				)?.id ?? '',
			mealGroup: 'breakfast',
			portion: '200.0',
			unit: 'g',
			userId: CLERK_USER_ID
		},
		{
			foodId: foodSelect.find(f => f.name === 'Flour, coconut')?.id ?? '',
			mealGroup: 'lunch',
			portion: '200.0',
			unit: 'g',
			userId: CLERK_USER_ID
		},
		{
			foodId: foodSelect.find(f => f.name === 'Flour, coconut')?.id ?? '',
			mealGroup: 'snack',
			portion: '200.0',
			unit: 'g',
			userId: CLERK_USER_ID
		},
		{
			foodId: foodSelect.find(f => f.name === 'Olive Oil')?.id ?? '',
			mealGroup: 'dinner',
			portion: '50.0',
			unit: 'g',
			userId: CLERK_USER_ID
		}
	]

	const exerciseCatSelect = await db
		.select({ id: exerciseCategory.id, name: exerciseCategory.name })
		.from(exerciseCategory)
		.where(
			or(
				eq(exerciseCategory.name, 'Gym'),
				eq(exerciseCategory.name, 'Cardio'),
				eq(exerciseCategory.name, 'Individual Sport')
			)
		)

	if (exerciseCatSelect.length < 3) {
		console.error(
			'You have to import all the exercise categories before seed the database with user exercises'
		)
		return
	}

	const exercises: {
		categoryId: string
		energyBurned: string
		effort: keyof typeof EFFORT_LEVELS
		userId: string
		duration: string
		diaryGroup: (typeof diaryGroupEnum.enumValues)[number]
	}[] = [
		{
			categoryId: exerciseCatSelect.find(e => e.name === 'Gym')?.id ?? '',
			energyBurned: '1391.0',
			effort: 'very-hard',
			userId: CLERK_USER_ID,
			duration: '120.0',
			diaryGroup: 'dinner'
		},
		{
			categoryId: exerciseCatSelect.find(e => e.name === 'Cardio')?.id ?? '',
			energyBurned: '1291.0',
			effort: 'very-hard',
			userId: CLERK_USER_ID,
			duration: '100.0',
			diaryGroup: 'breakfast'
		},
		{
			categoryId:
				exerciseCatSelect.find(e => e.name === 'Individual Sport')?.id ?? '',
			energyBurned: '1191.0',
			effort: 'very-hard',
			userId: CLERK_USER_ID,
			duration: '150.0',
			diaryGroup: 'snack'
		}
	]

	const initialDate = new Date(new Date().getFullYear() - 1, 0, 1)
	const consumtionSelect = await db
		.select({ id: consumption.id })
		.from(consumption)
		.limit(1)
	if (consumtionSelect.length === 0) {
		const consumtionData: (typeof consumption.$inferInsert)[] = Array.from(
			{ length: 365 },
			(_, i) => i
		).flatMap((_, i) => {
			const createdAt = new Date(
				initialDate.getTime() + i * 24 * 60 * 60 * 1000
			)
			return consumtions.map(consumtion => ({ ...consumtion, createdAt }))
		})

		await db.insert(consumption).values(consumtionData)
		console.log(
			`✅ Inserted ${consumtionData.length} consumptions successfully`
		)
	}

	const exerciseSelect = await db
		.select({ id: exercise.id })
		.from(exercise)
		.limit(1)
	if (exerciseSelect.length === 0) {
		const exerciseData: (typeof exercise.$inferInsert)[] = Array.from(
			{ length: 365 },
			(_, i) => i
		).flatMap((_, i) => {
			const createdAt = new Date(
				initialDate.getTime() + i * 24 * 60 * 60 * 1000
			)
			const exercise = exercises[
				Math.floor(Math.random() * 3)
			] as (typeof exercises)[number]
			const energyBurned = (
				Number(exercise.energyBurned) +
				Number(exercise.energyBurned) * (Math.random() * 0.3)
			).toFixed(2)
			const diaryGroup = ['breakfast', 'lunch', 'snack', 'dinner'][
				Math.floor(Math.random() * 4)
			] as (typeof diaryGroupEnum.enumValues)[number]
			return { ...exercise, createdAt, energyBurned, diaryGroup }
		})

		await db.insert(exercise).values(exerciseData)
		console.log(`✅ Inserted ${exerciseData.length} exercises successfully`)
	}
}
