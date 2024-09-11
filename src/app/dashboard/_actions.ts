'use server'

import { auth } from '@clerk/nextjs/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { db } from '~/server/db'
import { consumption, exercise } from '~/server/db/schema'
import { createInsertSchema } from 'drizzle-zod'

type NewConsumption = typeof consumption.$inferInsert

const ConsumptionSchema = z.object({
	userId: z.string({ required_error: 'You must be logged in to consume food' }),
	foodId: z.string({ required_error: 'Please select a food' }),
	portion: z
		.number({ required_error: 'Please enter a portion' })
		.positive({ message: 'Portion must be a positive number' })
		.transform(value => value.toString()),
	unit: z.enum(['g', 'oz', 'ml', 'cup'], {
		required_error: 'Please select a unit'
	})
})

export type ConsumptionState = {
	errors?: {
		portion?: string[]
		unit?: string[]
	}
	message?: string | null
	success?: boolean
}

export const addConsumption = async (
	prevState: ConsumptionState | undefined,
	formData: FormData
) => {
	const { userId } = auth()

	if (!userId)
		return { message: 'You must be logged in to consume food', success: false }

	const validatedFields = ConsumptionSchema.safeParse({
		userId,
		foodId: formData.get('foodId'),
		portion: Number(formData.get('portion')),
		unit: formData.get('unit')
	})

	if (!validatedFields.success) {
		return {
			errors: validatedFields.error.flatten().fieldErrors,
			message: 'Oops! There was an error with your submission.'
		}
	}

	try {
		const newConsumption: NewConsumption = {
			...validatedFields.data
		}

		await db.insert(consumption).values(newConsumption)
		revalidatePath('/dashboard')
		return { message: 'Consumption added successfully', success: true }
	} catch (error) {
		console.error(error)
		return {
			message: 'Consumption failed. Please try again later.',
			success: false
		}
	}
}

const exerciseSchema = createInsertSchema(exercise)

export type ExerciseState = {
	errors?: {
		energyBurned?: string[]
		duration?: string[]
	}
	message?: string | null
	success?: boolean
}

type NewExercise = typeof exercise.$inferInsert

export const addExercise = async (
	prevState: ExerciseState,
	formData: FormData
) => {
	const { userId } = auth()

	if (!userId)
		return {
			message: 'You must be logged in to add an exercise',
			success: false
		}

	const validatedFields = exerciseSchema.safeParse({
		userId,
		...Object.fromEntries(formData.entries())
	})

	if (!validatedFields.success) {
		return {
			errors: validatedFields.error.flatten().fieldErrors,
			message: 'Oops! There was an error with your submission.'
		}
	}

	try {
		const newExercise = validatedFields.data satisfies NewExercise
		await db.insert(exercise).values(newExercise)
		revalidatePath('/dashboard')
		return { message: 'Exercise added successfully', success: true }
	} catch (error) {
		console.error('There was an error inserting a exercise:', error)
		return {
			message: 'Exercise registration failed. Please try again later.',
			success: false
		}
	}
}
