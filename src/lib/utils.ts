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
	if (value >= 1_000_000) {
		return `${(value / 1_000_000).toFixed(1)}M` // For millions
	} else if (value >= 1_000) {
		return `${(value / 1_000).toFixed(1)}k` // For thousands
	}
	return value.toFixed() // For values less than 1000
}
