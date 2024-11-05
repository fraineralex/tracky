'use client'

import * as React from 'react'
import { TrendingDown } from 'lucide-react'
import { Label, Pie, PieChart } from 'recharts'

import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle
} from '~/components/ui/card'
import {
	ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent
} from '~/components/ui/chart'
const chartData = [
	{ browser: 'protein', visitors: 575, fill: 'var(--color-protein)' },
	{ browser: 'vitamins', visitors: 300, fill: 'var(--color-vitamins)' },
	{
		browser: 'carbohydrates',
		visitors: 400,
		fill: 'var(--color-carbohydrates)'
	},
	{ browser: 'sugar', visitors: 150, fill: 'var(--color-sugar)' },
	{ browser: 'fats', visitors: 250, fill: 'var(--color-fats)' }
]

const chartConfig = {
	visitors: {
		label: 'Calories'
	},
	protein: {
		label: 'Proteins',
		color: 'hsl(var(--chart-1))'
	},
	vitamins: {
		label: 'Vitamins & Minerals',
		color: 'hsl(var(--chart-2))'
	},
	carbohydrates: {
		label: 'Carbohydrates',
		color: 'hsl(var(--chart-3))'
	},
	sugar: {
		label: 'Sugar',
		color: 'hsl(var(--chart-4))'
	},
	fats: {
		label: 'Fats',
		color: 'hsl(var(--chart-5))'
	}
} satisfies ChartConfig

export function CaloriesChart() {
	const totalVisitors = React.useMemo(() => {
		return chartData.reduce((acc, curr) => acc + curr.visitors, 0)
	}, [])

	return (
		<Card className='flex flex-col bg-background'>
			<CardHeader className='items-center pb-0'>
				<CardTitle>Today&apos;s Nutrition Summary</CardTitle>
			</CardHeader>
			<CardContent className='-mt-3 flex-1 pb-0'>
				<ChartContainer
					config={chartConfig}
					className='mx-auto aspect-square max-h-[250px]'
				>
					<PieChart>
						<ChartTooltip
							cursor={false}
							content={<ChartTooltipContent hideLabel />}
						/>
						<Pie
							data={chartData}
							dataKey='visitors'
							nameKey='browser'
							innerRadius={60}
							strokeWidth={5}
						>
							<Label
								content={({ viewBox }) => {
									if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
										return (
											<text
												x={viewBox.cx}
												y={viewBox.cy}
												textAnchor='middle'
												dominantBaseline='middle'
											>
												<tspan
													x={viewBox.cx}
													y={viewBox.cy}
													className='fill-foreground text-3xl font-bold'
												>
													{totalVisitors.toLocaleString()}
												</tspan>
												<tspan
													x={viewBox.cx}
													y={(viewBox.cy || 0) + 24}
													className='fill-muted-foreground'
												>
													Calories
												</tspan>
											</text>
										)
									}
								}}
							/>
						</Pie>
					</PieChart>
				</ChartContainer>
			</CardContent>
			<CardFooter className='-mt-3 flex-col gap-2 text-sm'>
				<div className='flex items-center gap-2 font-medium leading-none tracking-tight'>
					You have lost 4.2 kg of fat this month{' '}
					<TrendingDown className='h-4 w-4' />
				</div>
			</CardFooter>
		</Card>
	)
}
