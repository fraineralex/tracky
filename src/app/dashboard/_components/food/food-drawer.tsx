import * as React from 'react'

import { Button } from '~/components/ui/button'
import {
	DrawerClose,
	DrawerContent,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle
} from '~/components/ui/drawer'
import { Food } from './columns'
import { Badge } from '~/components/ui/badge'
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
import { db } from '~/server/db'
import { food } from '~/server/db/schema'

function FoodCardItem({
	item
}: {
	item: {
		name: string
		value: string | number
		percent: string | null
		balance?: string
		color: null | string
	}
}) {
	console.log(db.select().from(food))
	
	const getBalanceBadge = (balance: string | undefined) => {
		switch (balance) {
			case 'well':
				return {
					color: 'bg-green-500 dark:bg-green-600',
					text: 'Well Balanced'
				}
			case 'moderate':
				return {
					color: 'bg-yellow-500 dark:bg-yellow-600',
					text: 'Moderately Balanced'
				}
			case 'poor':
				return {
					color: 'bg-red-500 dark:bg-red-600',
					text: 'Poorly Balanced'
				}
			default:
				return {
					color: 'bg-gray-500 dark:bg-gray-600',
					text: 'Unknown Balance'
				}
		}
	}

	const isCalories = item.name === 'Calories'

	return (
		<div
			key={item.name}
			className='mx-auto flex h-full flex-col items-center justify-between'
		>
			<div className='flex flex-col items-center'>
				{isCalories ? (
					<Badge
						className={`${getBalanceBadge(item.balance).color} mb-2 text-nowrap rounded-full text-white`}
					>
						{getBalanceBadge(item.balance).text}
					</Badge>
				) : item.percent !== null ? (
					<Badge className={`${item.color} mb-2 rounded-full text-white`}>
						{item.percent}%
					</Badge>
				) : (
					<div className='mb-2 h-6' />
				)}
				<span
					className={`font-bold ${isCalories ? 'text-3xl' : 'text-2xl'} mb-2 text-gray-900 dark:text-gray-100`}
				>
					{item.value}
				</span>
			</div>
			<span className='text-center text-sm text-gray-600 dark:text-gray-400'>
				{item.name}
			</span>
		</div>
	)
}

export function FoodDrawer({ foodData }: { foodData: Food }) {
	const [portion, setPortion] = React.useState('100')
	const [unit, setUnit] = React.useState<keyof typeof unitConversions>('g')
	const [mealGroup, setMealGroup] = React.useState('uncategorized')

	const unitConversions = {
		g: 1,
		ml: 0.001,
		oz: 28.3495,
		cup: 240
	}

	const portionInGrams = parseFloat(portion || '0') * unitConversions[unit]

	const adjustedCalories = (foodData.kcal * portionInGrams) / 100
	const adjustedProtein = (foodData.protein * portionInGrams) / 100
	const adjustedFat = (foodData.fat * portionInGrams) / 100
	const adjustedCarbs = (foodData.carbs * portionInGrams) / 100

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

	return (
		<DrawerContent>
			<div className='mx-auto w-full max-w-xl'>
				<DrawerHeader>
					<DrawerTitle className='text-center'>{foodData.name}</DrawerTitle>
				</DrawerHeader>
				<div className='mx-auto w-full max-w-md p-4 pb-0'>
					<Card className='mx-auto border-0 bg-transparent ps-7'>
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
					<div className='mt-10 w-full items-center bg-transparent ps-5'>
						<aside className='flex justify-between pb-3'>
							<Label className='text-base font-semibold'>Serving Size</Label>
							<Label className='text-base font-semibold'>Diary Group</Label>
						</aside>
						<div className='flex items-center justify-between space-x-4'>
							<div className='min-w-0'>
								<Label htmlFor='portion' className='sr-only'>
									Portion
								</Label>
								<Input
									id='portion'
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
					</div>
				</div>
				<DrawerFooter>
					<div className='mx-auto flex space-x-5 py-5'>
						<DrawerClose asChild>
							<Button variant='outline' className='px-16 dark:border-gray-400'>
								Cancel
							</Button>
						</DrawerClose>
						<Button className='px-16'>Add</Button>
					</div>
				</DrawerFooter>
			</div>
		</DrawerContent>
	)
}
