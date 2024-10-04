import { Circle, Square } from 'lucide-react'
import InsightsCard from '../_components/insights-card'
import ResumeStreak from '../_components/resume-streak'
import { Weights } from '~/types'

export default function DataAndHabits({
	weights,
	weightUnit,
	updatedAt
}: {
	weights: Weights
	weightUnit: string
	updatedAt: string
}) {
	const currentWeight = weights[weights.length - 1]?.value ?? 0
	const dateRange = `${new Date(updatedAt).toLocaleDateString('en-US', {
		day: 'numeric',
		month: 'short'
	})} - Now`
	return (
		<section className='mt-3 grid max-w-[460px] grid-cols-2 md:mt-8 md:flex md:max-w-full md:space-x-2 lg:justify-between mx-auto gap-3 md:gap-0'>
			<InsightsCard
				title='Nutrition'
				dateRange={dateRange}
				value={0}
				valueUnit='kcal'
				className='w-56 rounded-lg border bg-slate-200/50 p-4 pb-1 dark:bg-slate-800/50 md:w-full md:max-w-xs'
			>
				<div className='mb-3 mt-3 flex place-content-end'>
					<Square className='h-4 w-4 text-yellow-400' strokeWidth={4} />
				</div>
			</InsightsCard>
			<ResumeStreak />
			<InsightsCard
				title='Scale Weight'
				dateRange={dateRange}
				value={currentWeight}
				valueUnit={weightUnit}
				className='w-56 rounded-lg border bg-slate-200/50 p-4 pb-1 dark:bg-slate-800/50 md:w-full md:max-w-xs'
			>
				<div className='mb-3 mt-3 flex place-content-end'>
					<Circle className='h-4 w-4 text-green-400' strokeWidth={4} />
				</div>
			</InsightsCard>
		</section>
	)
}
