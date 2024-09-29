import { Circle, Square } from 'lucide-react'
import { Progress } from '~/components/ui/progress'
import InsightsCard from '../_components/insights-card'
import { GOAL_FACTORS } from '~/constants'
import { goal } from '~/types'

export default function InsightsAndAnalitics({
	expenditure,
	weight,
	weightUnit,
	updatedAt,
	currentWeight,
	goal
}: {
	expenditure: number
	weight: number
	weightUnit: string
	updatedAt: string
	currentWeight: number
	goal: goal
}) {
	const dateRange = `${new Date(updatedAt).toLocaleDateString('en-US', {
		day: 'numeric',
		month: 'short'
	})} - Now`

	const daysFromLastUpdate = Math.floor(
		(new Date().getTime() - new Date(updatedAt).getTime()) /
			(1000 * 60 * 60 * 24)
	)

	const goalWeight = GOAL_FACTORS[goal] * weight
	const goalProgress = Math.floor(
		((currentWeight - goalWeight) / (weight - goalWeight)) * 100
	)
	console.log(currentWeight, goalWeight, goalProgress)
	return (
		<aside className=''>
			<div className='flex space-x-3'>
				<InsightsCard
					title='Expenditure'
					dateRange={dateRange}
					value={expenditure}
					valueUnit='kcal'
				>
					<span className='mb-8 mt-8 flex place-content-end'>
						<Square className='h-4 w-4 text-red-400' strokeWidth={4} />
					</span>
				</InsightsCard>
				<InsightsCard
					title='Weight Trend'
					dateRange={dateRange}
					value={weight}
					valueUnit={weightUnit}
				>
					<span className='mb-8 mt-8 flex place-content-end'>
						<Circle className='h-4 w-4 text-purple-400' strokeWidth={4} />
					</span>
				</InsightsCard>
			</div>
			<InsightsCard
				title='Goal Progress'
				dateRange={dateRange}
				value={daysFromLastUpdate}
				valueUnit='days in'
				className='mt-3 w-full rounded-lg border bg-slate-200/50 p-4 pb-1 dark:bg-slate-800/50'
			>
				<Progress value={goalProgress} className='mb-8 mt-8 h-4' />
			</InsightsCard>
		</aside>
	)
}
