import { Activity, Clock, Flame, TrendingUp } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { getDuration } from '~/lib/utils'
import { ExerciseMetricsData } from '~/types'

export default function ExerciseMetrics({
	metrics
}: {
	metrics: ExerciseMetricsData
}) {
	const mainMetrics = [
		{
			name: 'Total Energy Burned',
			value: `${metrics.totalEnergyBurned.toLocaleString()} kcal`,
			icon: Flame
		},
		{
			name: 'Total Exercise Time',
			value: getDuration(metrics.totalDuration),
			icon: Clock
		},
		{
			name: 'Exercises This Week',
			value: metrics.exercisesThisWeek.toLocaleString(),
			icon: Activity
		},
		{
			name: 'Avg. Session Duration',
			value: getDuration(metrics.avgDuration),
			icon: TrendingUp
		}
	]

	return (
		<div className='mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4'>
			{mainMetrics.map(metric => (
				<Card
					key={metric.name}
					className='transition-shadow hover:shadow-lg dark:bg-slate-800/50'
				>
					<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
						<CardTitle className='text-sm font-medium'>{metric.name}</CardTitle>
						<metric.icon className='h-4 w-4 text-muted-foreground' />
					</CardHeader>
					<CardContent>
						<div className='text-2xl font-bold'>{metric.value}</div>
					</CardContent>
				</Card>
			))}
		</div>
	)
}
