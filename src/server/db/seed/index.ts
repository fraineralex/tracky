import { db } from '..'
import { exerciseCategory, food } from '../schema'
import { categories } from './categories.json'
import { foods } from './foods.json'

async function seed() {
	const exerciseCategoryCount = await db
		.select({ id: exerciseCategory.id })
		.from(exerciseCategory)
		.limit(1)
	if (exerciseCategoryCount.length === 0) {
		await db.insert(exerciseCategory).values(categories)
		console.log(
			`✅ Inserted ${categories.length} exercise categories successfully`
		)
	}

	const foodSelect = await db.select({ id: food.id }).from(food).limit(1)
	if (foodSelect.length === 0) {
		await db.insert(food).values(foods)
		console.log(`✅ Inserted ${foods.length} food items successfully`)
	}
}

seed().catch(error => console.error('Error inserting seed data:', error))
