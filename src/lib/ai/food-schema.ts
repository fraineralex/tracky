import { createInsertSchema } from 'drizzle-zod'
import { z } from 'zod'
import { food, unitEnum } from '~/server/db/schema'

export const FoodSchema = createInsertSchema(food, {
	name: z.string({ required_error: 'Please enter a name for the food' }),
	kcal: z.coerce
		.number({ required_error: 'Please enter the number of calories' })
		.nonnegative({ message: 'Number of calories must be a positive number' })
		.transform(value => value.toString()),
	protein: z.coerce
		.number({ required_error: 'Please enter the number of protein' })
		.nonnegative({ message: 'The number of protein must be a positive number' })
		.transform(value => value.toString()),
	carbs: z.coerce
		.number({ required_error: 'Please enter the number of carbs' })
		.nonnegative({ message: 'The number of carbs must be a positive number' })
		.transform(value => value.toString()),
	fat: z.coerce
		.number({ required_error: 'Please enter the number of fats' })
		.nonnegative({ message: 'The number of fats must be a positive number' })
		.transform(value => value.toString()),
	servingSize: z.coerce
		.number({ required_error: 'Please enter the serving size' })
		.nonnegative({ message: 'The serving size must be a positive number' })
		.transform(value => value.toString()),
	unit: z.enum(unitEnum.enumValues, {
		required_error: 'Please select a unit of measure'
	})
})
