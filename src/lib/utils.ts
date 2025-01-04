import clsx, { ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

export function formatHeight(height: number) {
	const feet = Math.floor(height)
	const inches = Math.round((height - feet) * 12)
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
