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

const weeklyData = [
	{ name: 'Mon', fiber: 20, sugar: 30, sodium: 1800, vitaminC: 65 },
	{ name: 'Tue', fiber: 22, sugar: 25, sodium: 2000, vitaminC: 72 },
	{ name: 'Wed', fiber: 18, sugar: 35, sodium: 1600, vitaminC: 58 },
	{ name: 'Thu', fiber: 25, sugar: 20, sodium: 1900, vitaminC: 80 },
	{ name: 'Fri', fiber: 23, sugar: 28, sodium: 2100, vitaminC: 75 },
	{ name: 'Sat', fiber: 19, sugar: 32, sodium: 1700, vitaminC: 62 },
	{ name: 'Sun', fiber: 21, sugar: 27, sodium: 1850, vitaminC: 70 }
]

const weightData = [
	{ name: 'Jan', weight: 70 },
	{ name: 'Feb', weight: 69 },
	{ name: 'Mar', weight: 68 },
	{ name: 'Apr', weight: 67.5 },
	{ name: 'May', weight: 67 },
	{ name: 'Jun', weight: 66 }
]

const goalData = [
	{ name: 'Calories', value: 84 },
	{ name: 'Protein', value: 75 },
	{ name: 'Carbs', value: 67 },
	{ name: 'Fat', value: 71 }
]

const macroData = [
	{ name: 'Protein', value: 25 },
	{ name: 'Carbs', value: 50 },
	{ name: 'Fat', value: 25 }
]

const microData = [
	{ name: 'Vitamin C', value: 80 },
	{ name: 'Iron', value: 60 },
	{ name: 'Calcium', value: 75 },
	{ name: 'Potassium', value: 65 }
]

export default function NutritionGraphic() {
	return (
		<Tabs
			defaultValue='weekly'
			className='space-y-16 sm:space-y-12 md:space-y-8 lg:space-y-2'
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
					value='goals'
					className='flex-grow data-[state=active]:bg-muted sm:flex-grow-0'
				>
					Goal Completion
				</TabsTrigger>
				<TabsTrigger
					value='macro'
					className='flex-grow data-[state=active]:bg-muted sm:flex-grow-0'
				>
					Macronutrients
				</TabsTrigger>
				<TabsTrigger
					value='micro'
					className='flex-grow data-[state=active]:bg-muted sm:flex-grow-0'
				>
					Micronutrients
				</TabsTrigger>
			</TabsList>
			<TabsContent value='weekly' className='mt-4 space-y-4'>
				<Card>
					<CardHeader>
						<CardTitle className='text-lg font-medium'>
							Weekly Nutritional Trends
						</CardTitle>
					</CardHeader>
					<CardContent className='pl-2'>
						<ResponsiveContainer width='100%' height={350}>
							<LineChart data={weeklyData}>
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
									dataKey='fiber'
									stroke='#4ade80'
									strokeWidth={2}
									name='Fiber'
								/>
								<Line
									type='monotone'
									dataKey='sugar'
									stroke='#f43f5e'
									strokeWidth={2}
									name='Sugar'
								/>
								<Line
									type='monotone'
									dataKey='sodium'
									stroke='#fbbf24'
									strokeWidth={2}
									name='Sodium'
								/>
								<Line
									type='monotone'
									dataKey='vitaminC'
									stroke='#3b82f6'
									strokeWidth={2}
									name='Vitamin C'
								/>
							</LineChart>
						</ResponsiveContainer>
					</CardContent>
				</Card>
			</TabsContent>
			<TabsContent value='weight' className='mt-4 space-y-4'>
				<Card>
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
									tickFormatter={value => `${value}kg`}
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
			<TabsContent value='goals' className='mt-4 space-y-4'>
				<Card>
					<CardHeader>
						<CardTitle className='text-lg font-medium'>
							Goal Completion Percentage
						</CardTitle>
					</CardHeader>
					<CardContent className='pl-2'>
						<ResponsiveContainer width='100%' height={350}>
							<BarChart data={goalData}>
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
			<TabsContent value='macro' className='mt-4 space-y-4'>
				<Card>
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
			<TabsContent value='micro' className='mt-4 space-y-4'>
				<Card>
					<CardHeader>
						<CardTitle className='text-lg font-medium'>
							Micronutrient Intake
						</CardTitle>
					</CardHeader>
					<CardContent className='pl-2'>
						<ResponsiveContainer width='100%' height={350}>
							<BarChart data={microData}>
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
								<Bar dataKey='value' fill='#ec4899' radius={[4, 4, 0, 0]} />
							</BarChart>
						</ResponsiveContainer>
					</CardContent>
				</Card>
			</TabsContent>
		</Tabs>
	)
}
