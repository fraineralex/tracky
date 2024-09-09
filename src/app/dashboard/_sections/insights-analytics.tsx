import { Circle, Square } from 'lucide-react'
import { Progress } from '~/components/ui/progress'
import InsightsCard from '../_components/insights-card'

export default function InsightsAndAnalitics() {
	return (
		<aside className=''>
			{/* <h2 className='text-start'>Insights & Analytics</h2> */}
			<div className='flex space-x-3'>
				<InsightsCard
					title='Expenditure'
					dateRange='Jul 14 - Now'
					value={3016}
					valueUnit='kcal'
				>
					<span className='mb-8 mt-8 flex place-content-end'>
						<Square className='h-4 w-4 text-red-400' strokeWidth={4} />
					</span>
				</InsightsCard>
				<InsightsCard
					title='Weight Trend'
					dateRange='Jul 14 - Now'
					value={195.0}
					valueUnit='lbs'
				>
					<span className='mb-8 mt-8 flex place-content-end'>
						<Circle className='h-4 w-4 text-purple-400' strokeWidth={4} />
					</span>
				</InsightsCard>
			</div>
			<InsightsCard
				title='Goal Progress'
				dateRange='Jul 14 - Now'
				value={10}
				valueUnit='days in'
				className='mt-3 w-full rounded-lg dark:bg-slate-800/50 bg-slate-200/50 p-4 pb-1 border'
			>
				<Progress value={10} className='mb-8 mt-8 py-2' />
			</InsightsCard>
		</aside>
	)
}
