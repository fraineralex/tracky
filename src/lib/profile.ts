import { calculateBodyFat } from '~/lib/calculations'
import { type ActivityLevel, type Goal, type Sex } from '~/types'
import { type ExerciseBody, type UserProfile } from '~/types/profile'

const HEAVY_METADATA_KEYS = [
	'sex',
	'born',
	'goal',
	'height',
	'weights',
	'activity',
	'goalWeight',
	'fat',
	'updatedAt'
] as const

/** Clerk merge-deletes a key when it is set to null. Leaves only the onboarding flag. */
export function clearedClerkMetadata(metadata?: unknown): UserPublicMetadata {
	const patch: Record<string, boolean | null> = { onboardingCompleted: true }
	for (const key of HEAVY_METADATA_KEYS) patch[key] = null
	if (metadata && typeof metadata === 'object') {
		for (const key of Object.keys(metadata as Record<string, unknown>)) {
			if (key !== 'onboardingCompleted') patch[key] = null
		}
	}
	return patch as UserPublicMetadata
}

export function hasHeavyMetadata(metadata: unknown): boolean {
	if (!metadata || typeof metadata !== 'object') return false
	const record = metadata as Record<string, unknown>
	return HEAVY_METADATA_KEYS.some(key => record[key] != null)
}

function isGoal(value: unknown): value is Goal {
	return value === 'gain' || value === 'maintain' || value === 'lose'
}

function isActivity(value: unknown): value is ActivityLevel {
	return value === 'sedentary' || value === 'moderate' || value === 'active'
}

function isSex(value: unknown): value is Sex {
	return value === 'male' || value === 'female'
}

function isNumber(value: unknown): value is number {
	return typeof value === 'number' && Number.isFinite(value)
}

function isDatedEntries<T>(
	value: unknown,
	isValue: (entry: unknown) => entry is T
): value is { value: T; date: string }[] {
	if (!Array.isArray(value)) return false
	return value.every(entry => {
		if (!entry || typeof entry !== 'object') return false
		const item = entry as Record<string, unknown>
		return isValue(item.value) && typeof item.date === 'string'
	})
}

/** Read a profile previously stored on Clerk public metadata. */
export function parseLegacyProfile(metadata: unknown): UserProfile | null {
	if (!metadata || typeof metadata !== 'object') return null
	const record = metadata as Record<string, unknown>
	const {
		sex,
		born,
		goal,
		height,
		weights,
		activity,
		goalWeight,
		fat,
		updatedAt
	} = record

	if (!isSex(sex) || typeof born !== 'string' || born.length === 0) return null
	if (!isDatedEntries(goal, isGoal)) return null
	if (!isDatedEntries(height, isNumber)) return null
	if (!isDatedEntries(weights, isNumber)) return null
	if (!isDatedEntries(activity, isActivity)) return null
	if (!isDatedEntries(goalWeight, isNumber)) return null
	if (!isDatedEntries(fat, isNumber)) return null

	return {
		sex,
		born,
		goal,
		height,
		weights,
		activity,
		goalWeight,
		fat,
		updatedAt:
			typeof updatedAt === 'string' && updatedAt.length > 0 ? updatedAt : born
	}
}

/**
 * Apply a settings patch the same way Clerk's metadata merge did:
 * weight and height history grow, other tracked fields replace the array.
 */
export function applyProfilePatch(
	current: UserProfile,
	patch: Partial<UserProfile>
): UserProfile {
	const next: UserProfile = {
		...current,
		height: [...current.height],
		weights: [...current.weights]
	}

	const shouldRecalculate =
		patch.born != null ||
		patch.height != null ||
		patch.sex != null ||
		patch.weights != null

	if (shouldRecalculate) {
		const nextWeight = patch.weights?.[0]
		if (nextWeight) next.weights.push(nextWeight)

		if (patch.born) next.born = patch.born

		const nextHeight = patch.height?.[0]
		if (nextHeight) next.height.push(nextHeight)

		if (patch.sex) next.sex = patch.sex

		if (patch.fat) {
			next.fat = [
				...patch.fat,
				{
					value: calculateBodyFat(next),
					date: new Date().toISOString().split('T')[0]!
				}
			]
		}
	} else if (patch.fat) {
		next.fat = patch.fat
	}

	if (patch.activity) next.activity = patch.activity
	if (patch.goal) next.goal = patch.goal
	if (patch.goalWeight) next.goalWeight = patch.goalWeight

	return next
}

export function toExerciseBody(profile: UserProfile): ExerciseBody {
	return {
		weight: profile.weights[profile.weights.length - 1]?.value ?? 0,
		height: profile.height[profile.height.length - 1]?.value ?? 0,
		born: profile.born,
		sex: profile.sex
	}
}
