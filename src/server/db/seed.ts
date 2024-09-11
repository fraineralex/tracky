import { db } from '.'
import { exerciseCategory } from './schema'

async function seed() {
	const categories = [
		{ name: 'Gym', label: '🏋️‍♂️ Gym Workout' },
		{ name: 'Cardio', label: '🏃‍♂️ Cardio Workout' },
		{ name: 'Household Activity', label: '🧹 Household Chores' },
		{ name: 'Individual Sport', label: '🤸‍♂️ Individual Sport Activity' },
		{ name: 'Team Sport', label: '⚽ Team Sport Activity' },
		{ name: 'Outdoor Activity', label: '🚴‍♂️ Outdoor Activity' },
		{ name: 'Stretching & Mobility', label: '🤸‍♀️ Stretching & Mobility' },
		{ name: 'Ocupational Activity', label: '👷‍♂️ Ocupational Activity' }
	]

	await db.insert(exerciseCategory).values(categories)
	console.log('Seed data inserted successfully')
}

seed().catch(error => console.error('Error inserting seed data:', error))
