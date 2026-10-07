'use server'

import { auth } from '@clerk/nextjs/server'
import { z } from 'zod'
import { GOAL_FACTORS } from '~/constants'
import { calculateBodyFat, round } from '~/lib/calculations'
import { markOnboardingComplete, saveUserProfile } from '~/server/user-profile'
import { type UserProfile } from '~/types/profile'

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
	heightUnit: z.enum(['cm', 'ft', 'm']).optional().default('ft'),
	heightDecimal: z.coerce.number().positive().optional()
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
		heightUnit: formData.get('heightUnit'),
		heightDecimal: formData.get('heightDecimal')
	})

	if (!validatedFields.success) {
		return {
			message: 'Onboarding failed. Please try again later.',
			success: false
		}
	}

	if (validatedFields.data.heightUnit != 'ft') {
		const heightMt =
			Number(
				`${validatedFields.data.height}.${validatedFields.data.heightDecimal ?? 1}`
			) / (validatedFields.data.heightUnit === 'cm' ? 100 : 1)

		validatedFields.data.height = round(heightMt * 3.28084, 2)
	} else {
		validatedFields.data.height = Number(
			`${validatedFields.data.height}.${validatedFields.data.heightDecimal ?? 1}`
		)
	}

	if (validatedFields.data.weightUnit === 'lb') {
		validatedFields.data.weights = Math.floor(
			validatedFields.data.weights * 0.45359237
		)
	}

	try {
		const date = new Date().toISOString().split('T')[0]!
		const profile: UserProfile = {
			sex: validatedFields.data.sex,
			weights: [
				{
					value: validatedFields.data.weights,
					date
				}
			],
			height: [
				{
					value: Number(validatedFields.data.height),
					date
				}
			],
			goalWeight: [
				{
					value: round(
						validatedFields.data.weights *
							GOAL_FACTORS[validatedFields.data.goal]
					),
					date
				}
			],
			activity: [
				{
					value: validatedFields.data.activity,
					date
				}
			],
			goal: [
				{
					value: validatedFields.data.goal,
					date
				}
			],
			born: validatedFields.data.born.toISOString().split('T')[0]!,
			updatedAt: new Date().toISOString().split('T')[0]!,
			fat: [{ value: 0, date }]
		}

		if (profile.fat[0]) profile.fat[0].value = calculateBodyFat(profile)

		await saveUserProfile(userId, profile)
		await markOnboardingComplete(userId)

		return { message: 'Onboarding completed succesfuly', success: true }
	} catch (err) {
		console.error(err)
		return {
			message: 'Onboarding failed. Please try again later.',
			success: false
		}
	}
}
