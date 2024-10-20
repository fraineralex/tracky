import { Activity, Clock, Flame, TrendingUp } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'

const mainMetrics = [
	{ name: 'Total Energy Burned', value: '2,543 kcal', icon: Flame },
	{ name: 'Total Exercise Time', value: '8h 15m', icon: Clock },
	{ name: 'Exercises This Week', value: '5', icon: Activity },
	{ name: 'Avg. Session Duration', value: '45 min', icon: TrendingUp }
]

export default function ExerciseMetrics() {
	return (
		<div className='mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4'>
			{mainMetrics.map(metric => (
				<Card key={metric.name} className='transition-shadow hover:shadow-lg dark:bg-slate-800/50'>
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
