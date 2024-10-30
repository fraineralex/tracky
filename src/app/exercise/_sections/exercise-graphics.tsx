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
import { Utensils, Sun, Coffee, Moon, TrendingUp } from 'lucide-react'
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

const weeklyEnergyBurned = [
	{ name: 'Mon', calories: 350 },
	{ name: 'Tue', calories: 280 },
	{ name: 'Wed', calories: 420 },
	{ name: 'Thu', calories: 380 },
	{ name: 'Fri', calories: 400 },
	{ name: 'Sat', calories: 500 },
	{ name: 'Sun', calories: 300 }
]

const weeklyEnergyConfig: ChartConfig = {
	calories: {
		label: 'Calories Burned',
		color: 'hsl(var(--chart-1))'
	}
}

const exerciseFrequency = [
	{
		date: '2023-10-01',
		gym: 60,
		walk: 30,
		run: 0,
		gymCal: 300,
		walkCal: 100,
		runCal: 0,
		gymIntensity: 'High',
		walkIntensity: 'Low',
		runIntensity: 'N/A',
		gymCategory: 'Strength',
		walkCategory: 'Cardio',
		runCategory: 'N/A'
	},
	{
		date: '2023-10-02',
		gym: 0,
		walk: 45,
		run: 30,
		gymCal: 0,
		walkCal: 150,
		runCal: 300,
		gymIntensity: 'N/A',
		walkIntensity: 'Medium',
		runIntensity: 'High',
		gymCategory: 'N/A',
		walkCategory: 'Cardio',
		runCategory: 'Cardio'
	},
	{
		date: '2023-10-03',
		gym: 75,
		walk: 0,
		run: 0,
		gymCal: 400,
		walkCal: 0,
		runCal: 0,
		gymIntensity: 'High',
		walkIntensity: 'N/A',
		runIntensity: 'N/A',
		gymCategory: 'Strength',
		walkCategory: 'N/A',
		runCategory: 'N/A'
	},
	{
		date: '2023-10-04',
		gym: 45,
		walk: 60,
		run: 0,
		gymCal: 250,
		walkCal: 200,
		runCal: 0,
		gymIntensity: 'Medium',
		walkIntensity: 'Medium',
		runIntensity: 'N/A',
		gymCategory: 'Strength',
		walkCategory: 'Cardio',
		runCategory: 'N/A'
	},
	{
		date: '2023-10-05',
		gym: 0,
		walk: 30,
		run: 45,
		gymCal: 0,
		walkCal: 100,
		runCal: 450,
		gymIntensity: 'N/A',
		walkIntensity: 'Low',
		runIntensity: 'High',
		gymCategory: 'N/A',
		walkCategory: 'Cardio',
		runCategory: 'Cardio'
	},
	{
		date: '2023-10-06',
		gym: 90,
		walk: 0,
		run: 0,
		gymCal: 500,
		walkCal: 0,
		runCal: 0,
		gymIntensity: 'High',
		walkIntensity: 'N/A',
		runIntensity: 'N/A',
		gymCategory: 'Strength',
		walkCategory: 'N/A',
		runCategory: 'N/A'
	},
	{
		date: '2023-10-07',
		gym: 0,
		walk: 90,
		run: 0,
		gymCal: 0,
		walkCal: 300,
		runCal: 0,
		gymIntensity: 'N/A',
		walkIntensity: 'High',
		runIntensity: 'N/A',
		gymCategory: 'N/A',
		walkCategory: 'Cardio',
		runCategory: 'N/A'
	}
]

const exerciseFrequencyConfig: ChartConfig = {
	gym: {
		label: 'Gym',
		color: 'hsl(var(--chart-1))'
	},
	walk: {
		label: 'Walk',
		color: 'hsl(var(--chart-2))'
	},
	run: {
		label: 'Run',
		color: 'hsl(var(--chart-3))'
	}
}

const timeCategories = [
	{ category: 'Morning', sessions: 8, icon: Sun },
	{ category: 'Lunch', sessions: 5, icon: Utensils },
	{ category: 'Snack', sessions: 3, icon: Coffee },
	{ category: 'Dinner', sessions: 7, icon: Moon }
]

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

export function ExerciseGraphics() {
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
								<BarChart data={weeklyEnergyBurned}>
									<XAxis dataKey='name' />
									<YAxis />
									<Bar dataKey='calories' fill='var(--color-calories)' />
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
								data={exerciseFrequency}
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
									tickFormatter={value => `${value}min`}
								/>
								<ChartTooltip
									cursor={false}
									content={<ChartTooltipContent />}
								/>

								<defs>
									<linearGradient id='fillGym' x1='0' y1='0' x2='0' y2='1'>
										<stop
											offset='5%'
											stopColor='var(--color-gym)'
											stopOpacity={0.8}
										/>
										<stop
											offset='95%'
											stopColor='var(--color-gym)'
											stopOpacity={0.1}
										/>
									</linearGradient>
									<linearGradient id='fillWalk' x1='0' y1='0' x2='0' y2='1'>
										<stop
											offset='5%'
											stopColor='var(--color-walk)'
											stopOpacity={0.8}
										/>
										<stop
											offset='95%'
											stopColor='var(--color-walk)'
											stopOpacity={0.1}
										/>
									</linearGradient>
									<linearGradient id='fillRun' x1='0' y1='0' x2='0' y2='1'>
										<stop
											offset='5%'
											stopColor='var(--color-run)'
											stopOpacity={0.8}
										/>
										<stop
											offset='95%'
											stopColor='var(--color-run)'
											stopOpacity={0.1}
										/>
									</linearGradient>
								</defs>
								<Area
									dataKey='walk'
									type='monotone'
									fill='url(#fillWalk)'
									fillOpacity={0.4}
									stroke='var(--color-walk)'
									stackId='1'
								/>
								<Area
									dataKey='gym'
									type='monotone'
									fill='url(#fillGym)'
									fillOpacity={0.4}
									stroke='var(--color-gym)'
									stackId='1'
								/>
								<Area
									dataKey='run'
									type='monotone'
									fill='url(#fillRun)'
									fillOpacity={0.4}
									stroke='var(--color-run)'
									stackId='1'
								/>
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
							{timeCategories.map(category => (
								<Card
									key={category.category}
									className='bg-slate-200 transition-shadow hover:shadow-md dark:bg-slate-500'
								>
									<CardContent className='flex flex-col items-center justify-center p-6'>
										<category.icon className='mb-2 h-8 w-8 text-primary' />
										<h3 className='text-lg font-semibold'>
											{category.category}
										</h3>
										<p className='text-2xl font-bold'>{category.sessions}</p>
										<p className='text-sm text-muted-foreground'>sessions</p>
									</CardContent>
								</Card>
							))}
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
