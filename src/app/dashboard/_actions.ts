'use server'

import { auth } from '@clerk/nextjs/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { db } from '~/server/db'
import {
	consumption,
	diaryGroupEnum,
	effortEnum,
	exercise,
	unitEnum
} from '~/server/db/schema'
import { createInsertSchema } from 'drizzle-zod'

export type NewConsumption = typeof consumption.$inferInsert

const ConsumptionSchema = createInsertSchema(consumption, {
	userId: z.string({ required_error: 'You must be logged in to consume food' }),
	foodId: z.string({ required_error: 'Please select a food' }),
	portion: z.coerce
		.number({ required_error: 'Please enter a portion' })
		.positive({ message: 'Portion must be a positive number' })
		.transform(value => value.toString()),
	unit: z.enum(unitEnum.enumValues, {
		required_error: 'Please select a unit of measure'
	}),
	mealGroup: z.enum(diaryGroupEnum.enumValues, {
		required_error: 'Please select a meal group option'
	})
})

export type ConsumptionState = {
	errors?: {
		portion?: string[]
		unit?: string[]
		mealGroup?: string[]
	}
	message?: string | null
	success?: boolean
}

export const addConsumption = async (
	prevState: ConsumptionState | undefined,
	formData: FormData
) => {
	const { userId } = await auth()

	if (!userId)
		return { message: 'You must be logged in to consume food', success: false }

	const validatedFields = ConsumptionSchema.safeParse({
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
		const newConsumption = validatedFields.data satisfies NewConsumption
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

const exerciseSchema = createInsertSchema(exercise, {
	duration: z.coerce
		.number({ required_error: 'Please enter your duration in minutes.' })
		.positive({ message: 'Duration must be a positive number' })
		.transform(value => value.toString()),
	energyBurned: z.coerce
		.number({ required_error: 'Energy burned is a required field.' })
		.positive({ message: 'Energy burned must be a positive number' })
		.transform(value => value.toString()),
	effort: z.enum(effortEnum.enumValues, {
		required_error: 'Please select an effort level option'
	}),
	diaryGroup: z.enum(diaryGroupEnum.enumValues, {
		required_error: 'Please select a diary group option'
	})
})

export type ExerciseState = {
	errors?: {
		energyBurned?: string[]
		duration?: string[]
		effort?: string[]
		diaryGroup?: string[]
	}
	message?: string | null
	success?: boolean
}

export type NewExercise = typeof exercise.$inferInsert

export const addExercise = async (
	prevState: ExerciseState,
	formData: FormData
) => {
	const { userId } = await auth()

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
