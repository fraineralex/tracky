'use server'

import { auth, clerkClient } from '@clerk/nextjs/server'
import { z } from 'zod'
import { GOAL_FACTORS } from '~/constants'
import { round } from '~/lib/utils'
import { calculateBodyFat } from '~/server/utils/nutrition'

const OnboardingSchema = z.object({
	sex: z.enum(['male', 'female'], { required_error: 'Please select a sex' }),
	born: z.preprocess(
		arg => {
			if (typeof arg === 'string' || arg instanceof Date) {
				return new Date(arg)
			}
		},
		z
			.date({
				required_error: 'Please enter your birth date'
			})
			.min(new Date('1900-01-01'), 'Date must be after 01-01-1900')
			.max(new Date(), 'Date must not be in the future')
	),
	height: z.coerce
		.number({ required_error: 'Please enter your height' })
		.positive()
		.max(300),
	weights: z.coerce
		.number({ required_error: 'Please enter your weight' })
		.positive()
		.max(600),
	goal: z.enum(['lose', 'maintain', 'gain'], {
		required_error: 'Please select a goal'
	}),
	activity: z.enum(['sedentary', 'moderate', 'active'], {
		required_error: 'Please select an activity level'
	}),
	weightUnit: z.enum(['lb', 'kg']).optional().default('lb'),
	heightUnit: z.enum(['cm', 'ft', 'm']).optional().default('ft')
})

export const completeOnboarding = async (formData: FormData) => {
	const { userId } = await auth()

	if (!userId)
		return {
			message: 'You must be logged in to complete onboarding',
			success: false
		}

	const validatedFields = OnboardingSchema.safeParse({
		sex: formData.get('sex'),
		born: formData.get('born'),
		height: formData.get('height'),
		weights: formData.get('weight'),
		goal: formData.get('goal'),
		activity: formData.get('activity'),
		weightUnit: formData.get('weightUnit'),
		heightUnit: formData.get('heightUnit')
	})

	if (!validatedFields.success) {
		return {
			message: 'Onboarding failed. Please try again later.',
			success: false
		}
	}

	if (validatedFields.data.heightUnit != 'cm') {
		const decimal =
			Number(formData.get('heightDecimal')) > 0
				? Number(formData.get('heightDecimal'))
				: 0
		validatedFields.data.height = parseFloat(
			`${validatedFields.data.height}.${decimal}`
		)
	}

	try {
		const publicMetadata: UserPublicMetadata = {
			onboardingCompleted: true,
			...validatedFields.data,
			weights: [
				{
					value: validatedFields.data.weights,
					date: new Date().toISOString().split('T')[0] as string,
					unit: validatedFields.data.weightUnit
				}
			],
			goalWeight: round(
				validatedFields.data.weights * GOAL_FACTORS[validatedFields.data.goal]
			),
			born: validatedFields.data.born.toISOString().split('T')[0] as string,
			updatedAt: new Date().toISOString().split('T')[0] as string,
			fat: 0
		}

		publicMetadata.fat = calculateBodyFat(publicMetadata)
		await (await clerkClient()).users.updateUser(userId, { publicMetadata })

		return { message: 'Onboarding completed succesfuly', success: true }
	} catch (err) {
		console.error(err)
		return {
			message: 'Onboarding failed. Please try again later.',
			success: false
		}
	}
}
