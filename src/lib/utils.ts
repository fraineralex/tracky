import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { EFFORT_LEVELS } from '~/constants'

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

export function calculateEnergyBurned({
	duration,
	effort,
	weight,
	weightUnit,
	age,
	sex,
	height,
	heightUnit,
	categoryMultiplier
}: {
	duration: number
	effort: string
	weight: number
	weightUnit: string
	age: number
	sex: string
	height: number
	heightUnit: string
	categoryMultiplier: number
}) {
	weight = weightUnit === 'kg' ? weight : weight * 0.453592

	if (heightUnit === 'ft') {
		height = height * 30.48
	} else if (heightUnit === 'in') {
		height = height * 2.54
	}

	const tmb =
		sex === 'male'
			? 88.362 + 13.397 * weight + 4.799 * height - 5.677 * age
			: 447.593 + 9.247 * weight + 3.098 * height - 4.33 * age

	const effortMultiplier =
		EFFORT_LEVELS[effort as keyof typeof EFFORT_LEVELS].multiplier

	const caloriesPerMinute = (tmb / 1440) * effortMultiplier * categoryMultiplier

	return (duration * caloriesPerMinute).toFixed(0)
}
