import { describe, expect, it } from 'vitest'
import {
	calculateAdjustedDay,
	calculateDuration,
	calculateEnergyBurned,
	calculateGoalProgress,
	calculateMacroPercentage,
	calculateNutritionalNeeds,
	calculatePercentage,
	calculateStreak,
	computeDailyUserStats,
	round
} from './calculations'

const baseUser: UserPublicMetadata = {
	onboardingCompleted: true,
	sex: 'male',
	born: '1990-06-15',
	goal: [{ value: 'maintain', date: '2024-01-01' }],
	height: [{ value: 5.1, date: '2024-01-01' }],
	weights: [
		{ value: 90, date: '2024-01-01' },
		{ value: 85, date: '2024-06-01' }
	],
	activity: [{ value: 'moderate', date: '2024-01-01' }],
	goalWeight: [
		{ value: 80, date: '2024-01-01' },
		{ value: 80, date: '2024-06-01' }
	],
	fat: [],
	updatedAt: '2024-06-01'
}

describe('calculateGoalProgress', () => {
	it('tracks weight-loss progress toward a lower goal', () => {
		const halfway = calculateGoalProgress(baseUser)
		const complete = calculateGoalProgress({
			...baseUser,
			weights: [
				{ value: 90, date: '2024-01-01' },
				{ value: 80, date: '2024-06-01' }
			]
		})

		expect(halfway).toBeGreaterThan(0)
		expect(complete).toBeGreaterThan(halfway)
	})

	it('tracks weight-gain progress toward a higher goal', () => {
		const halfway = calculateGoalProgress({
			...baseUser,
			weights: [
				{ value: 60, date: '2024-01-01' },
				{ value: 70, date: '2024-06-01' }
			],
			goalWeight: [{ value: 80, date: '2024-01-01' }]
		})
		const complete = calculateGoalProgress({
			...baseUser,
			weights: [
				{ value: 60, date: '2024-01-01' },
				{ value: 80, date: '2024-06-01' }
			],
			goalWeight: [{ value: 80, date: '2024-01-01' }]
		})

		expect(halfway).toBeGreaterThan(0)
		expect(complete).toBeGreaterThan(halfway)
	})

	it('returns 100 when starting weight equals goal weight', () => {
		const progress = calculateGoalProgress({
			...baseUser,
			weights: [{ value: 80, date: '2024-01-01' }],
			goalWeight: [{ value: 80, date: '2024-01-01' }]
		})
		expect(progress).toBe(100)
	})
})

describe('calculateNutritionalNeeds', () => {
	it('returns macro targets that sum to the adjusted calorie goal', () => {
		const needs = calculateNutritionalNeeds(baseUser)

		expect(needs.calories.needed).toBeGreaterThan(0)
		expect(needs.protein.needed).toBeGreaterThan(0)
		expect(needs.carbs.needed).toBeGreaterThan(0)
		expect(needs.fats.needed).toBeGreaterThan(0)
		expect(needs.calories.consumed).toBe(0)

		const macroCalories =
			needs.protein.needed * 4 +
			needs.carbs.needed * 4 +
			needs.fats.needed * 9
		expect(macroCalories).toBeGreaterThanOrEqual(needs.calories.needed - 15)
		expect(macroCalories).toBeLessThanOrEqual(needs.calories.needed + 15)
	})
})

describe('calculateEnergyBurned', () => {
	it('scales calories with duration and effort', () => {
		const easy = Number(
			calculateEnergyBurned({
				duration: 30,
				effort: 'easy',
				currentWeight: 80,
				age: 30,
				sex: 'male',
				height: 5.1,
				categoryMultiplier: 1
			})
		)
		const hard = Number(
			calculateEnergyBurned({
				duration: 30,
				effort: 'hard',
				currentWeight: 80,
				age: 30,
				sex: 'male',
				height: 5.1,
				categoryMultiplier: 1
			})
		)

		expect(easy).toBeGreaterThan(0)
		expect(hard).toBeGreaterThan(easy)
	})
})

describe('calculateStreak', () => {
	it('returns 1 when activity happened today', () => {
		const todayTime = new Date().setHours(0, 0, 0, 0)

		expect(calculateStreak([todayTime])).toBe(1)
	})

	it('returns 0 when the latest activity is not today', () => {
		const threeDaysAgo = new Date().setHours(0, 0, 0, 0) - 3 * 86400000
		const fourDaysAgo = threeDaysAgo - 86400000

		expect(calculateStreak([threeDaysAgo, fourDaysAgo])).toBe(0)
	})
})

describe('calculatePercentage', () => {
	it('caps displayed progress at 100%', () => {
		expect(calculatePercentage({ consumed: 2500, needed: 2000 })).toBe('100')
		expect(calculatePercentage({ consumed: 1000, needed: 2000 })).toBe('50')
	})
})

describe('calculateMacroPercentage', () => {
	it('returns 0 when no calories have been consumed', () => {
		expect(calculateMacroPercentage(50, 0)).toBe(0)
	})

	it('calculates macro share of consumed calories', () => {
		expect(calculateMacroPercentage(25, 100)).toBe(25)
	})
})

describe('calculateDuration', () => {
	it('formats minutes into hours and minutes', () => {
		expect(calculateDuration(0)).toBe(' 0m')
		expect(calculateDuration(45)).toBe(' 45m')
		expect(calculateDuration(90)).toBe('1h 30m')
	})
})

describe('calculateAdjustedDay', () => {
	it('maps Sunday to index 6 and Monday to index 0', () => {
		expect(calculateAdjustedDay(new Date('2024-01-01'))).toBe(0)
		expect(calculateAdjustedDay(new Date('2024-01-07'))).toBe(6)
	})
})

describe('computeDailyUserStats', () => {
	it('uses historical metrics for the requested date', () => {
		const stats = computeDailyUserStats({
			...baseUser,
			date: new Date('2024-03-01')
		})

		expect(stats.calories.needed).toBeGreaterThan(0)
		expect(stats.exercise.needed).toBeGreaterThan(0)
		expect(stats.exercise.burned).toBe(0)
	})
})

describe('round', () => {
	it('returns integers by default', () => {
		expect(round(1999.6)).toBe(2000)
		expect(round(42.4)).toBe(42)
	})
})
