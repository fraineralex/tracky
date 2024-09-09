import { Circle, Square } from 'lucide-react'
import InsightsCard from '../_components/insights-card'
import ResumeStreak from '../_components/resume-streak'

export default function DataAndHabits() {
	return (
		<section className='mt-8 flex justify-between'>
			<InsightsCard
				title='Nutrition'
				dateRange='Jul 14 - Now'
				value={0}
				valueUnit='kcal'
				className='w-full max-w-xs 2xl:max-w-xs rounded-lg dark:bg-slate-800/50 bg-slate-200/50 p-4 pb-1 border'
			>
				<div className='mb-3 mt-3 flex place-content-end'>
					<Square className='h-4 w-4 text-yellow-400' strokeWidth={4} />
				</div>
			</InsightsCard>
			<ResumeStreak />
			<InsightsCard
				title='Scale Weight'
				dateRange='Jul 14 - Now'
				value={195.0}
				valueUnit='lbs'
				className='w-full max-w-xs 2xl:max-w-xs rounded-lg dark:bg-slate-800/50 bg-slate-200/50 p-4 pb-1 border'
			>
				<div className='mb-3 mt-3 flex place-content-end'>
					<Circle className='h-4 w-4 text-green-400' strokeWidth={4} />
				</div>
			</InsightsCard>
		</section>
	)
}
