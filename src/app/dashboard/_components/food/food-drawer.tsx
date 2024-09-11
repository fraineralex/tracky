'use strict'

import * as React from 'react'
import { Button } from '~/components/ui/button'
import {
	DrawerClose,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle
} from '~/components/ui/drawer'
import { Food } from './columns'
import { Card } from '~/components/ui/card'
import { Label } from '~/components/ui/label'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '~/components/ui/select'
import { Input } from '~/components/ui/input'
import { toast } from 'sonner'
import { ConsumptionState, addConsumption } from '../../_actions'
import { useFormState } from 'react-dom'
import FoodCardItem from './food-card'

const initialState: ConsumptionState = {
	message: '',
	errors: {},
	success: false
}

export function FoodDrawer({
	foodData,
	handleDrawerClose
}: {
	foodData: Food
	handleDrawerClose: () => void
}) {
	const [portion, setPortion] = React.useState('100')
	const [unit, setUnit] = React.useState<keyof typeof unitConversions>('g')
	const [mealGroup, setMealGroup] = React.useState('uncategorized')

	const [state, formAction] = useFormState(addConsumption, initialState)

	const unitConversions = {
		g: 1,
		ml: 0.001,
		oz: 28.3495,
		cup: 240
	}

	const portionInGrams = parseFloat(portion || '0') * unitConversions[unit]

	const adjustedCalories = (parseFloat(foodData.kcal) * portionInGrams) / 100
	const adjustedProtein = (parseFloat(foodData.protein) * portionInGrams) / 100
	const adjustedFat = (parseFloat(foodData.fat) * portionInGrams) / 100
	const adjustedCarbs = (parseFloat(foodData.carbs) * portionInGrams) / 100

	const roundToK = (value: number) =>
		value < 1000 ? value.toFixed(0) : `${(value / 1000).toFixed(0)}k`

	const handlePortionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const newPortion = e.target.value
		const portionInGrams = parseInt(newPortion) * unitConversions[unit]

		if (portionInGrams <= 10000) {
			setPortion(newPortion)
		} else {
			toast.error('The portion exceeds the limit of 10,000 grams')
		}
	}

	if (state.success) handleDrawerClose()

	return (
		<DrawerContent>
			<div className='mx-auto w-full max-w-xl'>
				<DrawerHeader>
					<DrawerTitle className='text-center'>{foodData.name}</DrawerTitle>
					{state && state.message && !state.success && (
						<DrawerDescription className='text-center text-red-500'>
							{state.message}
						</DrawerDescription>
					)}
				</DrawerHeader>
				<div className='mx-auto w-full max-w-md p-4 pb-0'>
					<Card className='mx-auto border-0 bg-transparent ps-7 shadow-none'>
						<div className='mx-auto grid grid-cols-4 space-x-5'>
							<FoodCardItem
								item={{
									name: 'Calories',
									value: roundToK(adjustedCalories),
									percent: null,
									balance: 'well',
									color: null
								}}
							/>
							<FoodCardItem
								item={{
									name: 'Protein',
									value: roundToK(adjustedProtein),
									percent: (
										((adjustedProtein * 4) / adjustedCalories) * 100 || 0
									).toFixed(),
									color: 'bg-blue-500 dark:bg-blue-600'
								}}
							/>
							<FoodCardItem
								item={{
									name: 'Fat',
									value: roundToK(adjustedFat),
									percent: (
										((adjustedFat * 9) / adjustedCalories) * 100 || 0
									).toFixed(),
									color: 'bg-purple-500 dark:bg-purple-600'
								}}
							/>
							<FoodCardItem
								item={{
									name: 'Carbs',
									value: roundToK(adjustedCarbs),
									percent: (
										((adjustedCarbs * 4) / adjustedCalories) * 100 || 0
									).toFixed(),
									color: 'bg-orange-500 dark:bg-orange-600'
								}}
							/>
						</div>
					</Card>
					<form
						className='mt-10 w-full items-center bg-transparent px-4 ps-5'
						action={formAction}
					>
						<input type='hidden' name='foodId' value={foodData.id} />
						<aside className='flex justify-between pb-3'>
							<Label className='text-base font-semibold'>
								Serving Size
								{state &&
									state.errors?.portion &&
									state.errors.portion.map(error => (
										<p key={error} className='text-xs font-light text-red-500'>
											{error}
										</p>
									))}
							</Label>
							<Label className='text-base font-semibold'>Diary Group</Label>
						</aside>
						<div className='flex items-center justify-between space-x-4'>
							<div className='min-w-0'>
								<Label htmlFor='portion' className='sr-only'>
									Portion
									{state &&
										state.errors?.unit &&
										state.errors.unit.map(error => (
											<p
												key={error}
												className='text-sm font-light text-red-500'
											>
												{error}
											</p>
										))}
								</Label>
								<Input
									id='portion'
									name='portion'
									type='number'
									placeholder='Portion'
									value={portion}
									onChange={handlePortionChange}
									className='w-full max-w-24'
								/>
							</div>
							<div className='min-w-0'>
								<Label htmlFor='unit' className='sr-only'>
									Unit
								</Label>
								<Select
									name='unit'
									value={unit}
									onValueChange={(value: string) =>
										setUnit(value as keyof typeof unitConversions)
									}
								>
									<SelectTrigger id='unit'>
										<SelectValue placeholder='Unit' />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value='g'>Grams (g)</SelectItem>
										<SelectItem value='ml'>Milliliters (ml)</SelectItem>
										<SelectItem value='oz'>Ounces (oz)</SelectItem>
										<SelectItem value='cup'>Cups</SelectItem>
									</SelectContent>
								</Select>
							</div>
							<div className='min-w-0 '>
								<Label htmlFor='mealGroup' className='sr-only'>
									Meal Group
								</Label>
								<Select value={mealGroup} onValueChange={setMealGroup}>
									<SelectTrigger id='mealGroup'>
										<SelectValue placeholder='Meal Group' />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value='breakfast'>Breakfast</SelectItem>
										<SelectItem value='lunch'>Lunch</SelectItem>
										<SelectItem value='dinner'>Dinner</SelectItem>
										<SelectItem value='snack'>Snack</SelectItem>
										<SelectItem value='uncategorized'>Uncategorized</SelectItem>
									</SelectContent>
								</Select>
							</div>
						</div>
						<DrawerFooter className='mx-0 px-0'>
							<div className='flex space-x-5 py-5'>
								<DrawerClose asChild>
									<Button
										variant='outline'
										className='px-16 dark:border-gray-400'
									>
										Cancel
									</Button>
								</DrawerClose>
								<Button className='px-16'>Add</Button>
							</div>
						</DrawerFooter>
					</form>
				</div>
			</div>
		</DrawerContent>
	)
}
