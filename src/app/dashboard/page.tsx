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

				<head className='float-end flex space-x-5'>
					<FoodDialog />
					<ExerciseDialog />
				</head>
			</div>
			<article className='h-fit w-fit bg-slate-900/50 p-5'>
				<h2 className='mb-3'>Nutrition & Targets</h2>
				<div className='mb-2 grid grid-cols-10 space-x-10'>
					<div className='col-span-8 grid grid-flow-row'>
						<div className='flex space-x-5 border-b pb-2'>
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
						<div className='mt-2 flex space-x-5'>
							<span className='rounded-md bg-slate-800 px-4 py-5'></span>
							<span className='rounded-md bg-slate-800 px-4 py-5'></span>
							<span className='rounded-md bg-slate-800 px-4 py-5'></span>
							<span className='rounded-md bg-slate-800 px-4 py-5'></span>
							<span className='rounded-md bg-slate-800 px-4 py-5'></span>
							<span className='rounded-md bg-slate-800 px-4 py-5'></span>
							<span className='rounded-md bg-slate-800 px-4 py-5'></span>
						</div>
					</div>
					<aside className='col-span-2 flex flex-col place-content-center justify-between'>
						<p className='font-bold leading-tight'>
							0 🔥
							<small className='block text-sm font-normal text-gray-400'>
								of 3113
							</small>
						</p>
						<p className='font-bold leading-tight'>
							0 P
							<small className='block text-sm font-normal text-gray-400'>
								of 165
							</small>
						</p>
						<p className='font-bold leading-tight'>
							0 F
							<small className='block text-sm font-normal text-gray-400'>
								of 103
							</small>
						</p>
						<p className='font-bold leading-tight'>
							0 C
							<small className='block text-sm font-normal text-gray-400'>
								of 379
							</small>
						</p>
					</aside>
				</div>
				<div className='mt-4 flex space-x-10'>
					<span className='ps-2'>T</span>
					<span className=''>M</span>
					<span className=''>W</span>
					<span className=''>T</span>
					<span className=''>F</span>
					<span className=''>S</span>
					<span className='ps-2'>S</span>
				</div>
				<footer className='mt-4 flex place-content-center space-x-3'>
					<Button variant='default' className='rounded-full'>
						Consumed
					</Button>
					<Button variant='ghost' className='rounded-full'>
						Consumed
					</Button>
				</footer>
			</article>
		</section>
	)
}
