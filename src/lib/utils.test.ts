import { describe, expect, it } from 'vitest'
import { formatHeight, formatNumber, getMealCategoryFromTime } from './utils'

describe('getMealCategoryFromTime', () => {
	it('classifies meals by time of day', () => {
		expect(getMealCategoryFromTime(new Date('2024-01-01T08:00:00'))).toBe(
			'breakfast'
		)
		expect(getMealCategoryFromTime(new Date('2024-01-01T12:30:00'))).toBe(
			'lunch'
		)
		expect(getMealCategoryFromTime(new Date('2024-01-01T15:00:00'))).toBe(
			'snack'
		)
		expect(getMealCategoryFromTime(new Date('2024-01-01T19:00:00'))).toBe(
			'dinner'
		)
	})
})

describe('formatHeight', () => {
	it('formats imperial height values', () => {
		expect(formatHeight(5.1)).toBe('5′1"')
		expect(formatHeight(6.0)).toBe('6′0"')
	})
})

describe('formatNumber', () => {
	it('abbreviates large values for display', () => {
		expect(formatNumber(999)).toBe('999')
		expect(formatNumber(1500)).toBe('1.5k')
		expect(formatNumber(1100000)).toBe('1.1MM')
	})
})
