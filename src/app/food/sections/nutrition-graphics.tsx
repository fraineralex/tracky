'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs'
import {
	Bar,
	BarChart,
	ResponsiveContainer,
	XAxis,
	YAxis,
	Line,
	LineChart,
	Tooltip
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { CustomTooltip } from '../_components/custom-tooltip'
import {
	NutritionMetrics,
	NutritionMetricsPerDay,
	WeeklyNutrition,
	Weights
} from '~/types'
import {
	getAdjustedDay,
	getMacroPercentage,
	getPercentage,
	round
} from '~/lib/utils'

export default function NutritionGraphic({
	nutritionMeatrics,
	weightsChanges
}: {
	nutritionMeatrics: NutritionMetricsPerDay
	weightsChanges: Weights
}) {
	const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
	const nutritionWeek: WeeklyNutrition[] = Object.entries(
		nutritionMeatrics
	).map(([key, nutritients]) => {
		return {
			name: daysOfWeek[Number(key)] ?? '',
			calories: round(nutritients.calories.consumed),
			protein: round(nutritients.protein.consumed),
			fats: round(nutritients.fats.consumed),
			carbs: round(nutritients.carbs.consumed)
		}
	})

	const weekDay = getAdjustedDay(new Date())
	const todayNutrition = nutritionMeatrics[weekDay] as NutritionMetrics
	const todayGoalData = [
		{
			name: 'Calories',
			value: getPercentage(todayNutrition.calories)
		},
		{
			name: 'Protein',
			value: getPercentage(todayNutrition.protein)
		},
		{
			name: 'Carbs',
			value: getPercentage(todayNutrition.carbs)
		},
		{
			name: 'Fat',
			value: getPercentage(todayNutrition.fats)
		}
	]

	const weekGoalNutrition = Object.values(nutritionMeatrics).reduce(
		(acc, day) => {
			acc.calories.consumed += day.calories.consumed
			acc.protein.consumed += day.protein.consumed
			acc.fats.consumed += day.fats.consumed
			acc.carbs.consumed += day.carbs.consumed

			acc.calories.needed += day.calories.needed
			acc.protein.needed += day.protein.needed
			acc.fats.needed += day.fats.needed
			acc.carbs.needed += day.carbs.needed
			return acc
		}
	)

	const weekGoalData = [
		{
			name: 'Calories',
			value: getPercentage(weekGoalNutrition.calories)
		},
		{
			name: 'Protein',
			value: getPercentage(weekGoalNutrition.protein)
		},
		{
			name: 'Carbs',
			value: getPercentage(weekGoalNutrition.carbs)
		},
		{
			name: 'Fat',
			value: getPercentage(weekGoalNutrition.fats)
		}
	]

	const macroData = [
		{
			name: 'Protein',
			value: getMacroPercentage(
				todayNutrition.protein.consumed,
				todayNutrition.calories.consumed
			)
		},
		{
			name: 'Carbs',
			value: getMacroPercentage(
				todayNutrition.carbs.consumed,
				todayNutrition.calories.consumed
			)
		},
		{
			name: 'Fat',
			value: getMacroPercentage(
				todayNutrition.fats.consumed,
				todayNutrition.calories.consumed
			)
		}
	]

	const weightData = weightsChanges.map(({ value, date, unit }) => ({
		name: new Date(date).toLocaleDateString('en-US', {
			day: 'numeric',
			month: 'short'
		}),
		weight: unit === 'lb' ? round(value * 0.453592) : value
	}))

	return (
		<Tabs
			defaultValue='weekly'
			className='space-y-16 sm:space-y-12 md:space-y-8 xl:space-y-2'
		>
			<TabsList className='flex w-fit flex-wrap justify-start bg-background lg:bg-primary/5'>
				<TabsTrigger
					value='weekly'
					className='flex-grow data-[state=active]:bg-muted sm:flex-grow-0'
				>
					Weekly Trends
				</TabsTrigger>
				<TabsTrigger
					value='weight'
					className='flex-grow data-[state=active]:bg-muted sm:flex-grow-0'
				>
					Weight Changes
				</TabsTrigger>
				<TabsTrigger
					value='macro'
					className='flex-grow data-[state=active]:bg-muted sm:flex-grow-0'
				>
					Macronutrients
				</TabsTrigger>
				<TabsTrigger
					value='goalsToday'
					className='flex-grow data-[state=active]:bg-muted sm:flex-grow-0'
				>
					Goal (Today)
				</TabsTrigger>
				<TabsTrigger
					value='goalsWeek'
					className='flex-grow data-[state=active]:bg-muted sm:flex-grow-0'
				>
					Goal (Week)
				</TabsTrigger>
			</TabsList>
			<TabsContent value='weekly' className='mt-4 space-y-4'>
				<Card className='dark:bg-slate-800/50'>
					<CardHeader>
						<CardTitle className='text-lg font-medium'>
							Weekly Nutritional Trends
						</CardTitle>
					</CardHeader>
					<CardContent className='pl-2'>
						<ResponsiveContainer width='100%' height={350}>
							<LineChart data={nutritionWeek}>
								<XAxis
									dataKey='name'
									stroke='currentColor'
									fontSize={12}
									tickLine={false}
									axisLine={false}
								/>
								<YAxis
									stroke='currentColor'
									fontSize={12}
									tickLine={false}
									axisLine={false}
									tickFormatter={value => `${value}`}
								/>
								<Tooltip content={<CustomTooltip />} />
								<Line
									type='monotone'
									dataKey='calories'
									stroke='#3b82f6'
									strokeWidth={2}
									name='Calories'
								/>
								<Line
									type='monotone'
									dataKey='protein'
									stroke='#f43f5e'
									strokeWidth={2}
									name='Protein'
								/>
								<Line
									type='monotone'
									dataKey='fats'
									stroke='#fbbf24'
									strokeWidth={2}
									name='Fats'
								/>
								<Line
									type='monotone'
									dataKey='carbs'
									stroke='#4ade80'
									strokeWidth={2}
									name='Carbs'
								/>
							</LineChart>
						</ResponsiveContainer>
					</CardContent>
				</Card>
			</TabsContent>
			<TabsContent value='weight' className='mt-4 space-y-4'>
				<Card className='dark:bg-slate-800/50'>
					<CardHeader>
						<CardTitle className='text-lg font-medium'>
							Weight Changes
						</CardTitle>
					</CardHeader>
					<CardContent className='pl-2'>
						<ResponsiveContainer width='100%' height={350}>
							<LineChart data={weightData}>
								<XAxis
									dataKey='name'
									stroke='currentColor'
									fontSize={12}
									tickLine={false}
									axisLine={false}
								/>
								<YAxis
									stroke='currentColor'
									fontSize={12}
									tickLine={false}
									axisLine={false}
									tickFormatter={value => `${value} kg`}
								/>
								<Tooltip content={<CustomTooltip />} />
								<Line
									type='monotone'
									dataKey='weight'
									stroke='#10b981'
									strokeWidth={2}
								/>
							</LineChart>
						</ResponsiveContainer>
					</CardContent>
				</Card>
			</TabsContent>
			<TabsContent value='macro' className='mt-4 space-y-4'>
				<Card className='dark:bg-slate-800/50'>
					<CardHeader>
						<CardTitle className='text-lg font-medium'>
							Macronutrient Distribution
						</CardTitle>
					</CardHeader>
					<CardContent className='pl-2'>
						<ResponsiveContainer width='100%' height={350}>
							<BarChart data={macroData}>
								<XAxis
									dataKey='name'
									stroke='currentColor'
									fontSize={12}
									tickLine={false}
									axisLine={false}
								/>
								<YAxis
									stroke='currentColor'
									fontSize={12}
									tickLine={false}
									axisLine={false}
									tickFormatter={value => `${value}%`}
								/>
								<Tooltip content={<CustomTooltip />} cursor={false} />
								<Bar dataKey='value' fill='#3b82f6' radius={[4, 4, 0, 0]} />
							</BarChart>
						</ResponsiveContainer>
					</CardContent>
				</Card>
			</TabsContent>
			<TabsContent value='goalsToday' className='mt-4 space-y-4'>
				<Card className='dark:bg-slate-800/50'>
					<CardHeader>
						<CardTitle className='text-lg font-medium'>
							Today&apos;s Goal Completion Percentage
						</CardTitle>
					</CardHeader>
					<CardContent className='pl-2'>
						<ResponsiveContainer width='100%' height={350}>
							<BarChart data={todayGoalData}>
								<XAxis
									dataKey='name'
									stroke='currentColor'
									fontSize={12}
									tickLine={false}
									axisLine={false}
								/>
								<YAxis
									stroke='currentColor'
									fontSize={12}
									tickLine={false}
									axisLine={false}
									tickFormatter={value => `${value}%`}
								/>
								<Tooltip content={<CustomTooltip />} cursor={false} />
								<Bar dataKey='value' fill='#4ade80' radius={[4, 4, 0, 0]} />
							</BarChart>
						</ResponsiveContainer>
					</CardContent>
				</Card>
			</TabsContent>
			<TabsContent value='goalsWeek' className='mt-4 space-y-4'>
				<Card className='dark:bg-slate-800/50'>
					<CardHeader>
						<CardTitle className='text-lg font-medium'>
							Week Goal Completion Percentage
						</CardTitle>
					</CardHeader>
					<CardContent className='pl-2'>
						<ResponsiveContainer width='100%' height={350}>
							<BarChart data={weekGoalData}>
								<XAxis
									dataKey='name'
									stroke='currentColor'
									fontSize={12}
									tickLine={false}
									axisLine={false}
								/>
								<YAxis
									stroke='currentColor'
									fontSize={12}
									tickLine={false}
									axisLine={false}
									tickFormatter={value => `${value}%`}
								/>
								<Tooltip content={<CustomTooltip />} cursor={false} />
								<Bar dataKey='value' fill='#8b5cf6' radius={[4, 4, 0, 0]} />
							</BarChart>
						</ResponsiveContainer>
					</CardContent>
				</Card>
			</TabsContent>
		</Tabs>
	)
}
