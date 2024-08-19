import { Plus } from 'lucide-react'
import { Button } from '~/components/ui/button'
import FoodDialog from './_components/food-dialog'
import ExerciseDialog from './_components/exercise-dialog'

export default function DashboardPage() {
	return (
		<section className='w-full ps-5 pt-16'>
			<div className='flex justify-between'>
				<h1 className='mb-5 text-xl font-semibold uppercase'>
					{new Date().toLocaleDateString('en-US', {
						weekday: 'long',
						month: 'long',
						day: 'numeric'
					})}
				</h1>

				<article className='float-end flex space-x-5'>
					<FoodDialog />
					<ExerciseDialog />
				</article>
			</div>
			<article className='h-fit w-fit bg-slate-900/50 p-5'>
				<h2 className='mb-3'>Nutrition & Targets</h2>
				<div className='grid grid-flow-row'>
					<div className='mt-2 flex space-x-5 border-b pb-2'>
						<span className='rounded-md bg-slate-800 px-4 py-5'></span>
						<span className='rounded-md bg-slate-800 px-4 py-5'></span>
						<span className='rounded-md bg-slate-800 px-4 py-5'></span>
						<span className='rounded-md bg-slate-800 px-4 py-5'></span>
						<span className='rounded-md bg-slate-800 px-4 py-5'></span>
						<span className='rounded-md bg-slate-800 px-4 py-5'></span>
						<span className='rounded-md bg-slate-800 px-4 py-5'></span>
					</div>
					<div className='mt-2 flex space-x-5 border-b pb-2'>
						<span className='rounded-md bg-slate-800 px-4 py-5'></span>
						<span className='rounded-md bg-slate-800 px-4 py-5'></span>
						<span className='rounded-md bg-slate-800 px-4 py-5'></span>
						<span className='rounded-md bg-slate-800 px-4 py-5'></span>
						<span className='rounded-md bg-slate-800 px-4 py-5'></span>
						<span className='rounded-md bg-slate-800 px-4 py-5'></span>
						<span className='rounded-md bg-slate-800 px-4 py-5'></span>
					</div>
					<div className='mt-2 flex space-x-5 border-b pb-2'>
						<span className='rounded-md bg-slate-800 px-4 py-5'></span>
						<span className='rounded-md bg-slate-800 px-4 py-5'></span>
						<span className='rounded-md bg-slate-800 px-4 py-5'></span>
						<span className='rounded-md bg-slate-800 px-4 py-5'></span>
						<span className='rounded-md bg-slate-800 px-4 py-5'></span>
						<span className='rounded-md bg-slate-800 px-4 py-5'></span>
						<span className='rounded-md bg-slate-800 px-4 py-5'></span>
					</div>
					<div className='mt-2 flex space-x-5 pb-2'>
						<span className='rounded-md bg-slate-800 px-4 py-5'></span>
						<span className='rounded-md bg-slate-800 px-4 py-5'></span>
						<span className='rounded-md bg-slate-800 px-4 py-5'></span>
						<span className='rounded-md bg-slate-800 px-4 py-5'></span>
						<span className='rounded-md bg-slate-800 px-4 py-5'></span>
						<span className='rounded-md bg-slate-800 px-4 py-5'></span>
						<span className='rounded-md bg-slate-800 px-4 py-5'></span>
					</div>
					<div className='mt-2 flex space-x-10 pb-2'>
						<span className='ps-2'>T</span>
						<span className=''>M</span>
						<span className=''>W</span>
						<span className=''>T</span>
						<span className=''>F</span>
						<span className=''>S</span>
						<span className='ps-2'>S</span>
					</div>
				</div>
			</article>
		</section>
	)
}
