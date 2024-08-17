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
	weight: z.coerce
		.number({ required_error: 'Please enter your weight' })
		.positive()
		.max(600),
	goal: z.enum(['loss', 'maintain', 'gain'], {
		required_error: 'Please select a goal'
	}),
	activity: z.enum(['sedentary', 'moderate', 'active'], {
		required_error: 'Please select an activity level'
	}),
	weightUnit: z.enum(['lb', 'kg']).optional().default('lb'),
	heightUnit: z.enum(['cm', 'ft', 'm']).optional().default('ft')
})

export const completeOnboarding = async (formData: FormData) => {
	const { userId } = auth()

	if (!userId) return { message: 'No Logged In User' }

	const validatedFields = OnboardingSchema.safeParse({
		sex: formData.get('sex'),
		born: formData.get('born'),
		height: formData.get('height'),
		weight: formData.get('weight'),
		goal: formData.get('goal'),
		activity: formData.get('activity'),
		weightUnit: formData.get('weightUnit'),
		heightUnit: formData.get('heightUnit')
	})

	if (!validatedFields.success) {
		return {
			message: 'Onboarding failed. Please try again later.'
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

	console.log(validatedFields.data)

	try {
		await clerkClient().users.updateUser(userId, {
			publicMetadata: {
				onboardingComplete: true,
				...validatedFields.data
			}
		})

		return { message: 'Onboarding complete' }
	} catch (err) {
		return {
			message: 'Onboarding failed. Please try again later.'
		}
	}
}
