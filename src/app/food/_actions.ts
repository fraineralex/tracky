'use server'

import { auth } from '@clerk/nextjs/server'
import { createInsertSchema } from 'drizzle-zod'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { db } from '~/server/db'
import { food, unitEnum } from '~/server/db/schema'

type NewFood = typeof food.$inferInsert

const FoodSchema = createInsertSchema(food, {
	name: z.string({ required_error: 'Please enter a name for the food' }),
	kcal: z.coerce
		.number({ required_error: 'Please enter the number of calories' })
		.positive({ message: 'Number of calories must be a positive number' })
		.transform(value => value.toString()),
	protein: z.coerce
		.number({ required_error: 'Please enter the number of protein' })
		.positive({ message: 'The number of protein must be a positive number' })
		.transform(value => value.toString()),
	carbs: z.coerce
		.number({ required_error: 'Please enter the number of carbs' })
		.positive({ message: 'The number of carbs must be a positive number' })
		.transform(value => value.toString()),
	fat: z.coerce
		.number({ required_error: 'Please enter the number of Fats' })
		.positive({ message: 'The number of fats must be a positive number' })
		.transform(value => value.toString()),
	servingSize: z.coerce
		.number({ required_error: 'Please enter the serving size' })
		.positive({ message: 'The serving size must be a positive number' })
		.transform(value => value.toString()),
	unit: z.enum(unitEnum.enumValues, {
		required_error: 'Please select a unit of measure'
	})
})

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

export const registerFood = async (
	prevState: FoodState | undefined,
	formData: FormData
) => {
	const { userId } = auth()

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
		await db.insert(food).values(newFood)
		revalidatePath('/food')
		return { message: 'Food registered successfully', success: true }
	} catch (error) {
		console.error(error)
		
		return {
			message: 'Food registration failed. Please try again later',
			success: false
		}
	}
}
