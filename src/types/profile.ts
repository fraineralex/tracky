import {
	type ActivityLevel,
	type Goal,
	type Sex,
	type TrakedField
} from '~/types'

/** Body and goal history. Stored in the app database, not in the session token. */
export interface UserProfile {
	sex: Sex
	born: string
	goal: { value: Goal; date: string }[]
	height: TrakedField
	weights: TrakedField
	activity: { value: ActivityLevel; date: string }[]
	goalWeight: TrakedField
	fat: { value: number; date: string }[]
	updatedAt: string
}

/** Latest body stats the exercise form needs. Small enough to pass as props. */
export interface ExerciseBody {
	weight: number
	height: number
	born: string
	sex: Sex
}
