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
