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
	type ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent
} from '~/components/ui/chart'
import { type ExerciseGraphicsData } from '~/types'
import { type UserProfile } from '~/types/profile'
import { DAILY_MEAL_ICONS } from '~/constants'
import { calculateNeededCalories } from '~/lib/calculations'
import { useDictionary } from '~/components/providers/dictionary-provider'

export function ExerciseGraphics({
	exerciseData,
	userMetadata
}: {
	exerciseData: ExerciseGraphicsData
	userMetadata: UserProfile
}) {
	const { dictionary, locale } = useDictionary()
	const t = dictionary.exercise.graphics
	const dateLocale = locale === 'es' ? 'es-ES' : 'en-US'

	const weeklyEnergyConfig: ChartConfig = {
		calories: {
			label: t.caloriesBurned,
			color: 'hsl(var(--chart-1))'
		}
	}

	const monthlyProgressConfig: ChartConfig = {
		energyBurned: {
			label: t.energyBurnedKcal,
			color: 'hsl(var(--chart-1))'
		},
		time: {
			label: t.timeMinutes,
			color: 'hsl(var(--chart-2))'
		}
	}

	const exerciseCategories = Object.keys(
		exerciseData.exerciseFrequency[0] ?? {}
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

	const topSessionCategory = exerciseData.timeCategories
		.slice()
		.sort((a, b) => b.sessions - a.sessions)
		.at(0)!

	const totalWeeklyCalories = exerciseData.weeklyEnergyBurned.reduce(
		(sum, day) => sum + (day.value || 0),
		0
	)
	const targetWeeklyCalories = calculateNeededCalories(userMetadata) * 7 //Medium: 3000
	const percentageAchieved = (totalWeeklyCalories / targetWeeklyCalories) * 100

	const lastWeekTotal = exerciseData.exerciseFrequency
		.slice(-7)
		.reduce((acc, day) => {
			return (
				acc +
				exerciseCategories.reduce(
					(sum, category) => sum + (Number(day[category]) || 0),
					0
				)
			)
		}, 0)

	const avgTimePerDay = lastWeekTotal / 7

	const monthlyProgressMessage =
		percentageAchieved >= 100
			? t.messages.outstandingWork
			: percentageAchieved >= 70
				? t.messages.gettingCloser
				: t.messages.everyWorkoutCounts

	const exerciseFrequencyMessage =
		avgTimePerDay > 30
			? t.messages.amazingDedication
			: avgTimePerDay > 15
				? t.messages.buildingSolidRoutine
				: t.messages.increaseFrequency

	const capitalizedTime =
		topSessionCategory.name.at(0)?.toUpperCase() +
		topSessionCategory.name.slice(1)
	const topSessionMessage =
		topSessionCategory.sessions > 0
			? t.messages.greatJobExercising.replace('{time}', capitalizedTime)
			: t.messages.getCouchMessage

	const totalMonthlyEnergyBurned = exerciseData.monthlyProgress.reduce(
		(sum, week) => sum + (week.energyBurned || 0),
		0
	)
	const targetMonthlyEnergyBurned =
		calculateNeededCalories(userMetadata, { isExpenditure: true }) * 7 // Medium: 12000
	const monthlyPercentageAchieved =
		(totalMonthlyEnergyBurned / targetMonthlyEnergyBurned) * 100

	const monthlyProgressFooterMessage =
		monthlyPercentageAchieved >= 100
			? t.messages.outstandingMonthly
			: monthlyPercentageAchieved >= 70
				? t.messages.greatProgressMonth
				: t.messages.keepGoingEffort

	return (
		<Tabs defaultValue='energy' className='space-y-8 sm:space-y-4 md:space-y-2'>
			<TabsList className='flex w-fit flex-wrap justify-start bg-background lg:bg-primary/5'>
				<TabsTrigger
					value='energy'
					className='flex-grow data-[state=active]:bg-muted sm:flex-grow-0'
				>
					{t.tabs.energyBurned}
				</TabsTrigger>
				<TabsTrigger
					value='frequency'
					className='flex-grow data-[state=active]:bg-muted sm:flex-grow-0'
				>
					{t.tabs.exerciseFrequency}
				</TabsTrigger>
				<TabsTrigger
					value='time'
					className='flex-grow data-[state=active]:bg-muted sm:flex-grow-0'
				>
					{t.tabs.timeCategories}
				</TabsTrigger>
				<TabsTrigger
					value='progress'
					className='flex-grow data-[state=active]:bg-muted sm:flex-grow-0'
				>
					{t.tabs.monthlyProgress}
				</TabsTrigger>
			</TabsList>
			<TabsContent value='energy'>
				<Card className='dark:bg-slate-800/50'>
					<CardHeader>
						<CardTitle>{t.weeklyEnergyBurned}</CardTitle>
						<CardDescription>{t.caloriesBurnedEachDay}</CardDescription>
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
							{percentageAchieved >= 100 ? (
								<>
									{t.exceededTargetBy.replace(
										'{percent}',
										String(Math.round(percentageAchieved - 100))
									)}{' '}
									<TrendingUp className='h-4 w-4' />
								</>
							) : (
								<>
									{t.reachedWeeklyTarget.replace(
										'{percent}',
										String(Math.round(percentageAchieved))
									)}{' '}
									<TrendingUp className='h-4 w-4' />
								</>
							)}
						</div>
						<div className='leading-none text-muted-foreground'>
							{monthlyProgressMessage}
						</div>
					</CardFooter>
				</Card>
			</TabsContent>
			<TabsContent value='frequency'>
				<Card className='dark:bg-slate-800/50'>
					<CardHeader>
						<CardTitle>{t.exerciseFrequencyTitle}</CardTitle>
						<CardDescription>{t.dailyExerciseCompletion}</CardDescription>
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
									tickFormatter={(value: string | number | Date) =>
										new Date(value).toLocaleDateString(dateLocale, {
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
											id={`fill-${category}`}
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
							{avgTimePerDay > 30 ? (
								<>
									{t.excellentConsistency} <TrendingUp className='h-4 w-4' />
								</>
							) : avgTimePerDay > 15 ? (
								<>
									{t.makingGoodProgress} <TrendingUp className='h-4 w-4' />
								</>
							) : (
								<>{t.roomForImprovement}</>
							)}
						</div>
						<div className='leading-none text-muted-foreground'>
							{exerciseFrequencyMessage}
						</div>
					</CardFooter>
				</Card>
			</TabsContent>
			<TabsContent value='time'>
				<Card className='dark:bg-slate-800/50'>
					<CardHeader>
						<CardTitle>{t.timeCategoriesTitle}</CardTitle>
						<CardDescription>{t.distributionThroughoutDay}</CardDescription>
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
												{category.name.at(0)?.toUpperCase() +
													category.name.slice(1)}
											</h3>
											<p className='text-2xl font-bold'>{category.sessions}</p>
											<p className='text-sm text-muted-foreground'>
												{t.sessions}
											</p>
										</CardContent>
									</Card>
								)
							})}
						</div>
					</CardContent>
					<CardFooter className='flex-col items-start gap-2 text-sm'>
						<div className='flex gap-2 font-medium leading-none'>
							{topSessionCategory.sessions > 0 && (
								<>
									{t.mostActiveTime.replace(
										'{time}',
										topSessionCategory.name.at(0)?.toUpperCase() +
											topSessionCategory.name.slice(1)
									)}{' '}
									<TrendingUp className='h-4 w-4' />
								</>
							)}

							{topSessionCategory.sessions === 0 && <>{t.noActiveTimeYet}</>}
						</div>
						<div className='leading-none text-muted-foreground'>
							{topSessionMessage}
						</div>
					</CardFooter>
				</Card>
			</TabsContent>
			<TabsContent value='progress'>
				<Card className='dark:bg-slate-800/50'>
					<CardHeader>
						<CardTitle>{t.monthlyProgressTitle}</CardTitle>
						<CardDescription>{t.energyAndTimeMonth}</CardDescription>
					</CardHeader>
					<CardContent>
						<ChartContainer config={monthlyProgressConfig}>
							<LineChart
								accessibilityLayer
								data={exerciseData.monthlyProgress}
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
							{monthlyPercentageAchieved >= 100 ? (
								<>
									{t.exceededMonthlyTarget.replace(
										'{percent}',
										String(Math.round(monthlyPercentageAchieved - 100))
									)}{' '}
									<TrendingUp className='h-4 w-4' />
								</>
							) : (
								<>
									{t.reachedMonthlyTarget.replace(
										'{percent}',
										String(Math.round(monthlyPercentageAchieved))
									)}{' '}
									<TrendingUp className='h-4 w-4' />
								</>
							)}
						</div>
						<div className='leading-none text-muted-foreground'>
							{monthlyProgressFooterMessage}
						</div>
					</CardFooter>
				</Card>
			</TabsContent>
		</Tabs>
	)
}
