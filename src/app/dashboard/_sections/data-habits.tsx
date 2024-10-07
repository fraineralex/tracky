import { Circle, Square } from 'lucide-react'
import InsightsCard from '../_components/insights-card'
import ResumeStreak from '../_components/resume-streak'
import { PublicMetadata, Weights } from '~/types'
import { calculateNutritionalNeeds } from '~/lib/utils'

interface Props {
	userMetadata: PublicMetadata
	expenditure: number
}

export default async function DataAndHabits({
	userMetadata,
	expenditure
}: Props) {
	const currentWeight =
		userMetadata.weights[userMetadata.weights.length - 1]?.value ?? 0
	const dateRange = `${new Date(userMetadata.updatedAt).toLocaleDateString(
		'en-US',
		{
			day: 'numeric',
			month: 'short'
		}
	)} - Now`

	const weights = [userMetadata.weights[0]] as Weights
	const nutritionMeatrics = await calculateNutritionalNeeds({
		...userMetadata,
		weights
	})
	const caloriesChanges = Math.abs(
		nutritionMeatrics.calories.needed - expenditure
	)
	return (
		<section className='mx-auto mt-3 grid sm:max-w-[460px] grid-cols-2 gap-3 md:flex md:max-w-full md:gap-0 md:space-x-2 lg:justify-between'>
			<InsightsCard
				title='Nutrition'
				dateRange={dateRange}
				value={caloriesChanges}
				valueUnit='kcal'
				className='w-full sm:w-56 rounded-lg border p-4 pb-1 dark:bg-slate-800/50 md:w-full md:max-w-xs'
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
				valueUnit={userMetadata.weightUnit}
				className='w-full sm:w-56 rounded-lg border p-4 pb-1 dark:bg-slate-800/50 md:w-full md:max-w-xs'
			>
				<div className='mb-3 mt-3 flex place-content-end'>
					<Circle className='h-4 w-4 text-green-400' strokeWidth={4} />
				</div>
			</InsightsCard>
		</section>
	)
}
