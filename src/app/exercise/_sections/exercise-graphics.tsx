'use client'

import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	CardDescription,
	CardFooter
} from '~/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs'
import { TrendingUp } from 'lucide-react'
import {
	Area,
	AreaChart,
	Bar,
	BarChart,
	CartesianGrid,
	Line,
	LineChart,
	ResponsiveContainer,
	XAxis,
	YAxis
} from 'recharts'
import {
	ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent
} from '~/components/ui/chart'
import { ExerciseGraphicsData } from '~/types'
import { DAILY_MEAL_ICONS } from '~/constants'

const weeklyEnergyConfig: ChartConfig = {
	calories: {
		label: 'Calories Burned',
		color: 'hsl(var(--chart-1))'
	}
}

const monthlyProgress = [
	{ week: 'Week 1', energyBurned: 1500, time: 240 },
	{ week: 'Week 2', energyBurned: 1800, time: 300 },
	{ week: 'Week 3', energyBurned: 2200, time: 360 },
	{ week: 'Week 4', energyBurned: 2000, time: 330 }
]

const monthlyProgressConfig: ChartConfig = {
	energyBurned: {
		label: 'Energy Burned (kcal)',
		color: 'hsl(var(--chart-1))'
	},
	time: {
		label: 'Time (minutes)',
		color: 'hsl(var(--chart-2))'
	}
}

export function ExerciseGraphics({
	exerciseData
}: {
	exerciseData: ExerciseGraphicsData
}) {
	const exerciseCategories = Object.keys(
		exerciseData.exerciseFrequency[0]!
	).filter(key => key !== 'date')
	const exerciseFrequencyConfig = [...exerciseCategories].reduce(
		(acc, key, index) => {
			acc[key] = {
				label: key.at(0)?.toUpperCase() + key.slice(1),
				color: `hsl(var(--chart-${index + 1}))`
			}
			return acc
		},
		{} as ChartConfig
	)

	console.log(exerciseData.exerciseFrequency)
	return (
		<Tabs defaultValue='energy' className='space-y-8 sm:space-y-4 md:space-y-2'>
			<TabsList className='flex w-fit flex-wrap justify-start bg-background lg:bg-primary/5'>
				<TabsTrigger
					value='energy'
					className='flex-grow data-[state=active]:bg-muted sm:flex-grow-0'
				>
					Energy Burned
				</TabsTrigger>
				<TabsTrigger
					value='frequency'
					className='flex-grow data-[state=active]:bg-muted sm:flex-grow-0'
				>
					Exercise Frequency
				</TabsTrigger>
				<TabsTrigger
					value='time'
					className='flex-grow data-[state=active]:bg-muted sm:flex-grow-0'
				>
					Time Categories
				</TabsTrigger>
				<TabsTrigger
					value='progress'
					className='flex-grow data-[state=active]:bg-muted sm:flex-grow-0'
				>
					Monthly Progress
				</TabsTrigger>
			</TabsList>
			<TabsContent value='energy'>
				<Card className='dark:bg-slate-800/50'>
					<CardHeader>
						<CardTitle>Weekly Energy Burned</CardTitle>
						<CardDescription>Calories burned for each day</CardDescription>
					</CardHeader>
					<CardContent>
						<ChartContainer config={weeklyEnergyConfig}>
							<ResponsiveContainer width='100%' height={350}>
								<BarChart data={exerciseData.weeklyEnergyBurned}>
									<XAxis dataKey='day' />
									<YAxis />
									<Bar dataKey='value' fill='var(--color-calories)' />
									<ChartTooltip
										cursor={false}
										content={<ChartTooltipContent />}
									/>
								</BarChart>
							</ResponsiveContainer>
						</ChartContainer>
					</CardContent>
					<CardFooter className='flex-col items-start gap-2 text-sm'>
						<div className='flex gap-2 font-medium leading-none'>
							Exceeded target by 10% this week{' '}
							<TrendingUp className='h-4 w-4' />
						</div>
						<div className='leading-none text-muted-foreground'>
							Keep up the good work to maintain your progress!
						</div>
					</CardFooter>
				</Card>
			</TabsContent>
			<TabsContent value='frequency'>
				<Card className='dark:bg-slate-800/50'>
					<CardHeader>
						<CardTitle>Exercise Frequency</CardTitle>
						<CardDescription>
							Daily exercise completion over the past week
						</CardDescription>
					</CardHeader>
					<CardContent>
						<ChartContainer config={exerciseFrequencyConfig}>
							<AreaChart
								accessibilityLayer
								data={exerciseData.exerciseFrequency}
								margin={{
									left: 12,
									right: 12,
									top: 12,
									bottom: 12
								}}
							>
								<CartesianGrid vertical={false} />
								<XAxis
									dataKey='date'
									tickLine={false}
									axisLine={false}
									tickMargin={8}
									tickFormatter={value =>
										new Date(value).toLocaleDateString('en-US', {
											month: 'short',
											day: 'numeric'
										})
									}
								/>
								<YAxis
									tickLine={false}
									axisLine={false}
									tickMargin={8}
									tickFormatter={value => `${value} min`}
								/>
								<ChartTooltip
									cursor={false}
									content={<ChartTooltipContent />}
								/>

								<defs>
									{exerciseCategories.map(category => (
										<linearGradient
											id='fillGym'
											x1='0'
											y1='0'
											x2='0'
											y2='1'
											key={category}
										>
											<stop
												offset='5%'
												stopColor={`var(--color-${category})`}
												stopOpacity={0.8}
											/>
											<stop
												offset='95%'
												stopColor={`var(--color-${category})`}
												stopOpacity={0.1}
											/>
										</linearGradient>
									))}
								</defs>
								{exerciseCategories.map(category => (
									<Area
										key={category}
										dataKey={category}
										type='monotone'
										fill={`url(#fill-${category})`}
										fillOpacity={0.4}
										stroke={`var(--color-${category})`}
										stackId='1'
									/>
								))}
							</AreaChart>
						</ChartContainer>
					</CardContent>
					<CardFooter className='flex-col items-start gap-2 text-sm'>
						<div className='flex gap-2 font-medium leading-none'>
							Consistent exercise throughout the week{' '}
							<TrendingUp className='h-4 w-4' />
						</div>
						<div className='leading-none text-muted-foreground'>
							Great job maintaining a balanced exercise routine!
						</div>
					</CardFooter>
				</Card>
			</TabsContent>
			<TabsContent value='time'>
				<Card className='dark:bg-slate-800/50'>
					<CardHeader>
						<CardTitle>Exercise Time Categories</CardTitle>
						<CardDescription>
							Distribution of exercise sessions throughout the day
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className='grid grid-cols-2 gap-4 md:grid-cols-4'>
							{exerciseData.timeCategories.map(category => {
								const Icon = DAILY_MEAL_ICONS[category.name]
								return (
									<Card
										key={category.name}
										className='bg-slate-200 transition-shadow hover:shadow-md dark:bg-slate-500'
									>
										<CardContent className='flex flex-col items-center justify-center p-6'>
											<Icon className='mb-2 h-8 w-8 text-primary' />
											<h3 className='text-lg font-semibold'>
												{category.name.at(0)?.toUpperCase() + category.name.slice(1)}
											</h3>
											<p className='text-2xl font-bold'>{category.sessions}</p>
											<p className='text-sm text-muted-foreground'>sessions</p>
										</CardContent>
									</Card>
								)
							})}
						</div>
					</CardContent>
					<CardFooter className='flex-col items-start gap-2 text-sm'>
						<div className='flex gap-2 font-medium leading-none'>
							Morning is your most active time{' '}
							<TrendingUp className='h-4 w-4' />
						</div>
						<div className='leading-none text-muted-foreground'>
							Great job starting your day with exercise!
						</div>
					</CardFooter>
				</Card>
			</TabsContent>
			<TabsContent value='progress'>
				<Card className='dark:bg-slate-800/50'>
					<CardHeader>
						<CardTitle>Monthly Progress</CardTitle>
						<CardDescription>
							Energy burned and exercise time over the past month
						</CardDescription>
					</CardHeader>
					<CardContent>
						<ChartContainer config={monthlyProgressConfig}>
							<LineChart
								accessibilityLayer
								data={monthlyProgress}
								margin={{
									left: 0
								}}
							>
								<XAxis dataKey='week' />
								<YAxis yAxisId='left' />
								<YAxis yAxisId='right' orientation='right' />
								<ChartTooltip content={<ChartTooltipContent />} />
								<Line
									yAxisId='left'
									type='monotone'
									dataKey='energyBurned'
									stroke='var(--color-energyBurned)'
								/>
								<Line
									yAxisId='right'
									type='monotone'
									dataKey='time'
									stroke='var(--color-time)'
								/>
							</LineChart>
						</ChartContainer>
					</CardContent>
					<CardFooter className='flex-col items-start gap-2 text-sm'>
						<div className='flex gap-2 font-medium leading-none'>
							Steady increase in energy burned{' '}
							<TrendingUp className='h-4 w-4' />
						</div>
						<div className='leading-none text-muted-foreground'>
							Your consistency is paying off! Keep pushing your limits.
						</div>
					</CardFooter>
				</Card>
			</TabsContent>
		</Tabs>
	)
}
