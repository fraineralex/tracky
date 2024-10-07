import { Circle, Square } from 'lucide-react'
import { Progress } from '~/components/ui/progress'
import InsightsCard from '../_components/insights-card'
import { GOAL_FACTORS } from '~/constants'
import { Goal, Weights } from '~/types'

export default function InsightsAndAnalitics({
	expenditure,
	weights,
	weightUnit,
	updatedAt,
	goalWeight,
	goal
}: {
	expenditure: number
	weights: Weights
	weightUnit: string
	updatedAt: string
	goalWeight: number
	goal: Goal
}) {
	const currentWeight = weights[weights.length - 1]?.value ?? 0
	const initialWeight = weights[0]?.value ?? 0
	const dateRange = `${new Date(updatedAt).toLocaleDateString('en-US', {
		day: 'numeric',
		month: 'short'
	})} - Now`

	const daysFromLastUpdate = Math.floor(
		(new Date().getTime() - new Date(updatedAt).getTime()) /
			(1000 * 60 * 60 * 24)
	)

	let goalProgress: number = 0

	if (goal === 'maintain') {
		if (currentWeight === goalWeight) goalProgress = 100
		else
			goalProgress =
				100 -
				Math.abs(
					((currentWeight - goalWeight) / (initialWeight - goalWeight)) * 100
				)
	}

	if (goal === 'gain') {
		if (currentWeight <= initialWeight) goalProgress = 0
		else if (currentWeight >= goalWeight) goalProgress = 100
		else
			goalProgress =
				((currentWeight - initialWeight) / (goalWeight - initialWeight)) * 100
	}

	if (goal === 'lose') {
		if (currentWeight >= initialWeight) goalProgress = 0
		else if (currentWeight <= goalWeight) goalProgress = 100
		else
			goalProgress =
				((initialWeight - currentWeight) / (initialWeight - goalWeight)) * 100
	}

	return (
		<aside className='mx-auto md:mx-0'>
			<div className='flex space-x-3 sm:-mt-3'>
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
					value={currentWeight}
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
				className='-ml-3 mt-3 rounded-lg border p-4 pb-1 dark:bg-slate-800/50 sm:ml-0'
			>
				<Progress value={goalProgress} className='mb-6 mt-6 h-4' />
			</InsightsCard>
		</aside>
	)
}
