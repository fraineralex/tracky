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

export function FoodDrawer({ foodData }: { foodData: Food }) {
	const [portion, setPortion] = React.useState('100')
	const [unit, setUnit] = React.useState('g')
	const [mealGroup, setMealGroup] = React.useState('uncategorized')

	const nutritionData = [
		{ name: 'Calories', value: 256, balance: 'well', color: null },
		{
			name: 'Protein',
			value: 12.3,
			percent: 25,
			color: 'bg-blue-500 dark:bg-blue-600'
		},
		{
			name: 'Fat',
			value: 8.7,
			percent: 18,
			color: 'bg-purple-500 dark:bg-purple-600'
		},
		{
			name: 'Carbs',
			value: 30.5,
			percent: 57,
			color: 'bg-orange-500 dark:bg-orange-600'
		}
	]

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
				return { color: 'bg-red-500 dark:bg-red-600', text: 'Poorly Balanced' }
			default:
				return {
					color: 'bg-gray-500 dark:bg-gray-600',
					text: 'Unknown Balance'
				}
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
						<div className='mx-auto grid grid-cols-4'>
							{nutritionData.map((item, index) => (
								<div
									key={item.name}
									className={`mx-auto flex h-full flex-col items-center justify-between ${index === 0 ? 'pe-20' : undefined}`}
								>
									<div className='flex flex-col items-center'>
										{index === 0 ? (
											<Badge
												className={`${getBalanceBadge(item.balance).color} mb-2 text-nowrap rounded-full text-white`}
											>
												{getBalanceBadge(item.balance).text}
											</Badge>
										) : item.percent !== null ? (
											<Badge
												className={`${item.color} mb-2 rounded-full text-white`}
											>
												{item.percent}%
											</Badge>
										) : (
											<div className='mb-2 h-6' />
										)}
										<span
											className={`font-bold ${index === 0 ? 'text-3xl' : 'text-2xl'} mb-2 text-gray-900 dark:text-gray-100`}
										>
											{item.value.toFixed(1)}
										</span>
									</div>
									<span className='text-center text-sm text-gray-600 dark:text-gray-400'>
										{item.name}
									</span>
								</div>
							))}
						</div>
					</Card>
					<div className='items-center bg-transparent mt-10 w-full ps-5'>
						<aside className='flex justify-between'>
							<Label>Serving Size</Label>
							<Label>Diary Group</Label>
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
									onChange={e => setPortion(e.target.value)}
									className='w-full max-w-24'
								/>
							</div>
							<div className='min-w-0'>
								<Label htmlFor='unit' className='sr-only'>
									Unit
								</Label>
								<Select value={unit} onValueChange={setUnit}>
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
					<div className='mx-auto mt-10 flex space-x-5'>
						<DrawerClose asChild>
							<Button variant='outline' className='px-16'>
								Cancel
							</Button>
						</DrawerClose>
						<Button className='px-16'>Submit</Button>
					</div>
				</DrawerFooter>
			</div>
		</DrawerContent>
	)
}
