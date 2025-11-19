'use server'

import 'server-only'
import { auth } from '@clerk/nextjs/server'
import { revalidatePath, revalidateTag } from 'next/cache'
import { db } from '~/server/db'
import { food } from '~/server/db/schema'
import { FoodSchema } from '~/lib/ai/food-schema'

type NewFood = typeof food.$inferInsert

export type FoodState = {
	errors?: {
		name?: string[]
		kcal?: string[]
		protein?: string[]
		carbs?: string[]
		fat?: string[]
		servingSize?: string[]
		unit?: string[]
	}
	message?: string
	success?: boolean
}

const normalizeFoodUnits = (entry: NewFood) => {
	if (entry.unit === 'ml') entry.unit = 'g'

	if (entry.unit === 'g' && Number(entry.servingSize) !== 100) {
		const multiplier = 100 / Number(entry.servingSize)
		entry.kcal = (Number(entry.kcal) * multiplier).toFixed(2)
		entry.protein = (Number(entry.protein) * multiplier).toFixed(2)
		entry.carbs = (Number(entry.carbs) * multiplier).toFixed(2)
		entry.fat = (Number(entry.fat) * multiplier).toFixed(2)
		entry.servingSize = '100'
	}

	if (entry.unit === 'oz') {
		entry.unit = 'g'
		const multiplier = (100 / Number(entry.servingSize)) * 28.3495
		entry.kcal = (Number(entry.kcal) * multiplier).toFixed(2)
		entry.protein = (Number(entry.protein) * multiplier).toFixed(2)
		entry.carbs = (Number(entry.carbs) * multiplier).toFixed(2)
		entry.fat = (Number(entry.fat) * multiplier).toFixed(2)
		entry.servingSize = '100'
	}

	if (entry.unit === 'cup') {
		entry.unit = 'g'
		const multiplier = (100 / Number(entry.servingSize)) * 128
		entry.kcal = (Number(entry.kcal) * multiplier).toFixed(2)
		entry.protein = (Number(entry.protein) * multiplier).toFixed(2)
		entry.carbs = (Number(entry.carbs) * multiplier).toFixed(2)
		entry.fat = (Number(entry.fat) * multiplier).toFixed(2)
		entry.servingSize = '100'
	}
}

export const registerFood = async (
	prevState: FoodState | undefined,
	formData: FormData
) => {
	const { userId } = await auth()

	if (!userId)
		return {
			message: 'You must be logged in to register a food',
			success: false
		}

	const validatedFields = FoodSchema.safeParse({
		userId,
		...Object.fromEntries(formData.entries())
	})

	if (!validatedFields.success)
		return {
			errors: validatedFields.error.flatten().fieldErrors,
			message: 'Oops! There was an error with your submission.'
		}

	try {
		const newFood = validatedFields.data satisfies NewFood
		normalizeFoodUnits(newFood)

		await db.insert(food).values(newFood)
		revalidateTag('food')
		revalidatePath('/food')
		revalidatePath('/diary')
		return { message: 'Food registered successfully', success: true }
	} catch (error) {
		console.error(error)
		return {
			message: 'Food registration failed. Please try again later',
			success: false
		}
	}
}
