import clsx, { ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

export function formatHeight(height: number) {
	const feet = Math.floor(height)
	const inches = Math.floor((height - feet) * 12)
	return `${feet}′${inches}"`
}

export function formatNumber(value: number): string {
	if (value >= 1_100_000) {
		return `${(value / 1_000_000).toFixed(1)}MM`
	} else if (value >= 1_000_000) {
		return `${(value / 1_000_000).toFixed()}MM`
	} else if (value >= 1_100) {
		return `${(value / 1_000).toFixed(1)}k`
	} else if (value >= 1_000) {
		return `${(value / 1_000).toFixed()}k`
	}
	return value.toFixed()
}

export function getMealCategoryFromTime(date: Date): 'breakfast' | 'lunch' | 'snack' | 'dinner' {
	const hours = date.getHours()
	const minutes = date.getMinutes()
	const totalMinutes = hours * 60 + minutes

	if (totalMinutes >= 5 * 60 && totalMinutes < 12 * 60) {
		return 'breakfast'
	}
	if (totalMinutes >= 12 * 60 && totalMinutes <= 14 * 60) {
		return 'lunch'
	}
	if (totalMinutes > 14 * 60 && totalMinutes < 17 * 60) {
		return 'snack'
	}
	return 'dinner'
}