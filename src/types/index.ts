import { exerciseCategory } from '~/server/db/schema'

export type sex = 'male' | 'female'

export type ExerciseCategories = Array<typeof exerciseCategory.$inferSelect>
