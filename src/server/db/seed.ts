import { db } from '.'
import { exerciseCategory } from './schema'

async function seed() {
	const categories = [
		{
			name: 'Gym',
			label: '🏋️‍♂️ Gym Workout',
			energyBurnedPerMinute: '4.16'
		},
		{
			name: 'Cardio',
			label: '🏃‍♂️ Cardio Workout',
			energyBurnedPerMinute: '9.92'
		},
		{
			name: 'Household Activity',
			label: '🧹 Household Chores',
			energyBurnedPerMinute: '2.9'
		},
		{
			name: 'Individual Sport',
			label: '🤸‍♂️ Individual Sport Activity',
			energyBurnedPerMinute: '5.6'
		},
		{
			name: 'Team Sport',
			label: '⚽ Team Sport Activity',
			energyBurnedPerMinute: '5.6'
		},
		{
			name: 'Outdoor Activity',
			label: '🚴‍♂️ Outdoor Activity',
			energyBurnedPerMinute: '3.2'
		},
		{
			name: 'Stretching & Mobility',
			label: '🤸‍♀️ Stretching & Mobility',
			energyBurnedPerMinute: '2.1'
		},
		{
			name: 'Ocupational Activity',
			label: '👷‍♂️ Ocupational Activity',
			energyBurnedPerMinute: '1.3'
		}
	]

	await db.insert(exerciseCategory).values(categories)
	console.log('Seed data inserted successfully')
}

seed().catch(error => console.error('Error inserting seed data:', error))
