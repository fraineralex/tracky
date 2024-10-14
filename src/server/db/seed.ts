import { db } from '.'
import { exerciseCategory, food, unitEnum } from './schema'

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

	type FoodItem = {
		name: string
		protein: string
		kcal: string
		fat: string
		carbs: string
		servingSize: string
		unit: (typeof unitEnum.enumValues)[number]
	}

	const foodItems: FoodItem[] = [
		{
			name: 'Almonds',
			protein: '21',
			kcal: '579',
			fat: '49',
			carbs: '22',
			servingSize: '100',
			unit: 'g'
		},
		{
			name: 'Apple',
			protein: '2',
			kcal: '105',
			fat: '1',
			carbs: '28',
			servingSize: '100',
			unit: 'g'
		},
		{
			name: 'Avocado',
			protein: '2',
			kcal: '160',
			fat: '15',
			carbs: '9',
			servingSize: '150',
			unit: 'g'
		},
		{
			name: 'Banana',
			protein: '1.1',
			kcal: '89',
			fat: '0.3',
			carbs: '23',
			servingSize: '118',
			unit: 'g'
		},
		{
			name: 'Beef Steak',
			protein: '25',
			kcal: '271',
			fat: '19',
			carbs: '0',
			servingSize: '150',
			unit: 'g'
		},
		{
			name: 'Blueberries',
			protein: '0.7',
			kcal: '57',
			fat: '0.3',
			carbs: '14',
			servingSize: '100',
			unit: 'g'
		},
		{
			name: 'Broccoli',
			protein: '3.7',
			kcal: '55',
			fat: '0.6',
			carbs: '11',
			servingSize: '150',
			unit: 'g'
		},
		{
			name: 'Brown Rice',
			protein: '5',
			kcal: '215',
			fat: '1.8',
			carbs: '45',
			servingSize: '200',
			unit: 'g'
		},
		{
			name: 'Carrots',
			protein: '1',
			kcal: '41',
			fat: '0.2',
			carbs: '10',
			servingSize: '100',
			unit: 'g'
		},
		{
			name: 'Cheddar Cheese',
			protein: '25',
			kcal: '403',
			fat: '33',
			carbs: '1.3',
			servingSize: '100',
			unit: 'g'
		},
		{
			name: 'Chicken Fried Steak',
			protein: '25.1',
			kcal: '126',
			fat: '2.9',
			carbs: '20',
			servingSize: '100',
			unit: 'g'
		},
		{
			name: 'Cottage Cheese',
			protein: '11.1',
			kcal: '98',
			fat: '4.3',
			carbs: '3.4',
			servingSize: '100',
			unit: 'g'
		},
		{
			name: 'Eggs Scrambled',
			protein: '6.7',
			kcal: '91',
			fat: '6.7',
			carbs: '1.6',
			servingSize: '100',
			unit: 'g'
		},
		{
			name: 'Greek Yogurt',
			protein: '10',
			kcal: '59',
			fat: '0.4',
			carbs: '3.6',
			servingSize: '100',
			unit: 'g'
		},
		{
			name: 'Green Beans',
			protein: '1.8',
			kcal: '31',
			fat: '0.1',
			carbs: '7',
			servingSize: '100',
			unit: 'g'
		},
		{
			name: 'Grilled Chicken Breast',
			protein: '31',
			kcal: '165',
			fat: '3.6',
			carbs: '0',
			servingSize: '120',
			unit: 'g'
		},
		{
			name: 'Lentils',
			protein: '9',
			kcal: '116',
			fat: '0.4',
			carbs: '20',
			servingSize: '100',
			unit: 'g'
		},
		{
			name: 'Mango',
			protein: '1.3',
			kcal: '105',
			fat: '0.3',
			carbs: '27',
			servingSize: '118',
			unit: 'g'
		},
		{
			name: 'Oats',
			protein: '17',
			kcal: '389',
			fat: '7',
			carbs: '66',
			servingSize: '100',
			unit: 'g'
		},
		{
			name: 'Orange',
			protein: '0.9',
			kcal: '47',
			fat: '0.1',
			carbs: '12',
			servingSize: '130',
			unit: 'g'
		},
		{
			name: 'Pasta',
			protein: '5',
			kcal: '131',
			fat: '1.1',
			carbs: '25',
			servingSize: '100',
			unit: 'g'
		},
		{
			name: 'Peanut Butter',
			protein: '25',
			kcal: '588',
			fat: '50',
			carbs: '20',
			servingSize: '100',
			unit: 'g'
		},
		{
			name: 'Quinoa',
			protein: '4.4',
			kcal: '120',
			fat: '1.9',
			carbs: '21',
			servingSize: '100',
			unit: 'g'
		},
		{
			name: 'Salmon Fillet',
			protein: '20',
			kcal: '208',
			fat: '13',
			carbs: '0',
			servingSize: '100',
			unit: 'g'
		},
		{
			name: 'Shrimp',
			protein: '24',
			kcal: '99',
			fat: '0.3',
			carbs: '0.2',
			servingSize: '100',
			unit: 'g'
		},
		{
			name: 'Spinach',
			protein: '2.9',
			kcal: '23',
			fat: '0.4',
			carbs: '3.6',
			servingSize: '100',
			unit: 'g'
		},
		{
			name: 'Sweet Potato',
			protein: '2',
			kcal: '86',
			fat: '0.1',
			carbs: '20',
			servingSize: '150',
			unit: 'g'
		},
		{
			name: 'Tofu',
			protein: '8.1',
			kcal: '76',
			fat: '4.8',
			carbs: '1.9',
			servingSize: '100',
			unit: 'g'
		},
		{
			name: 'Tuna',
			protein: '29',
			kcal: '132',
			fat: '0.5',
			carbs: '0',
			servingSize: '100',
			unit: 'g'
		},
		{
			name: 'Turkey Breast',
			protein: '29',
			kcal: '135',
			fat: '1.5',
			carbs: '0',
			servingSize: '100',
			unit: 'g'
		},
		{
			name: 'Whole Wheat Bread',
			protein: '13',
			kcal: '247',
			fat: '4.2',
			carbs: '41',
			servingSize: '100',
			unit: 'g'
		}
	]
	const categoriesSelect = await db
		.select({ name: exerciseCategory.name })
		.from(exerciseCategory)
		.limit(1)
	if (categoriesSelect.length === 0)
		await db.insert(exerciseCategory).values(categories)

	const foodSelect = await db
		.select({ name: food.name })
		.from(food)
		.limit(1)
	if (foodSelect.length === 0) await db.insert(food).values(foodItems)

	console.log('Seed data inserted successfully')
}

seed().catch(error => console.error('Error inserting seed data:', error))
