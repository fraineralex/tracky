'use server'

import { auth, clerkClient } from '@clerk/nextjs/server'
import { z } from 'zod'

const OnboardingSchema = z.object({
	sex: z.enum(['male', 'female'], { required_error: 'Please select a sex' }),
	born: z.preprocess(
		arg => {
			if (typeof arg === 'string' || arg instanceof Date) {
				return new Date(arg)
			}
		},
		z.date({
				required_error: 'Please enter your birth date'
			})
			.min(new Date('1900-01-01'), 'Date must be after 01-01-1900')
			.max(new Date(), 'Date must not be in the future')
	),
	height: z.coerce
		.number({ required_error: 'Please enter your height' })
		.positive()
		.max(300),
	weight: z.coerce
		.number({ required_error: 'Please enter your weight' })
		.positive()
		.max(600),
	goal: z.enum(['lose', 'maintain', 'gain'], {
		required_error: 'Please select a goal'
	}),
	activity: z.enum(
		['sedentary', 'light', 'moderate', 'active', 'very active'],
		{ required_error: 'Please select an activity level' }
	),
	weightUnit: z.enum(['lb', 'kg']).optional().default('lb'),
	heightUnit: z.enum(['cm', 'ft']).optional().default('cm')
})

export type State = {
	errors?: {
		sex?: string[]
		born?: string[]
		height?: string[]
		weight?: string[]
		goal?: string[]
		activity?: string[]
		weightUnit?: string[]
		heightUnit?: string[]
	}
	message?: string | null
	onboardingComplete?: boolean
}

export const completeOnboarding = async (
	prevState: State,
	formData: FormData
) => {
	const { userId } = auth()

	if (!userId) return { message: 'No Logged In User' }

	const validatedFields = OnboardingSchema.safeParse({
		sex: formData.get('sex'),
		born: formData.get('born'),
		height: Number(formData.get('height')),
		weight: Number(formData.get('weight')),
		goal: formData.get('goal'),
		activity: formData.get('activity'),
		weightUnit: formData.get('weightUnit'),
		heightUnit: formData.get('heightUnit')
	})

	if (!validatedFields.success) {
		return {
			errors: validatedFields.error.flatten().fieldErrors,
			message: 'Please correct the errors below.'
		}
	}

	if (validatedFields.data.heightUnit === 'ft') {
		validatedFields.data.height *= 30.48
		validatedFields.data.heightUnit = 'cm'
	}

	if (validatedFields.data.weightUnit === 'kg') {
		validatedFields.data.weight *= 2.20462
		validatedFields.data.weightUnit = 'lb'
	}

	try {
		await clerkClient().users.updateUser(userId, {
			publicMetadata: {
				onboardingComplete: true,
				...validatedFields.data
			}
		})

		return { message: 'Onboarding failed. Please try again later.' }

		return { onboardingComplete: true }
	} catch (err) {
		return { message: 'Onboarding failed. Please try again later.' }
	}
}
