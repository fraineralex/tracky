'use server'

import { auth } from '@clerk/nextjs/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { db } from '~/server/db'
import { consumption } from '~/server/db/schema'

type NewConsumption = typeof consumption.$inferInsert

const ConsumptionSchema = z.object({
	userId: z.string({ required_error: 'You must be logged in to consume food' }),
	foodId: z.string({ required_error: 'Please select a food' }),
	portion: z.string({ required_error: 'Please enter a portion' }),
	unit: z.enum(['g', 'oz', 'ml', 'cup'], {
		required_error: 'Please select a unit'
	})
})

export type State = {
	errors?: {
		portion?: string[]
		unit?: string[]
	}
	message?: string | null
}

export const addConsumption = async (
	prevState: State | undefined,
	formData: FormData
) => {
	const { userId } = auth()

	if (!userId) return { message: 'No Logged In User' }

	const validatedFields = ConsumptionSchema.safeParse({
		userId,
		foodId: formData.get('foodId'),
		portion: Number(formData.get('portion')),
		unit: formData.get('unit')
	})

	if (!validatedFields.success) {
		const state: State = {
			errors: validatedFields.error.flatten().fieldErrors,
			message: 'Oops! There was an error with your submission.'
		}

		return state
	}

	try {
		const newConsumption: NewConsumption = {
			...validatedFields.data
		}

		await db.insert(consumption).values(newConsumption)
		revalidatePath('/dashboard')
		return { message: 'Consumption added successfully', errors: {} }
	} catch (error) {
		console.error(error)
		return {
			message: 'Consumption failed. Please try again later.',
			errors: {}
		}
	}
}
