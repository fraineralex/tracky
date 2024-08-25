import { ChevronRight, Circle, Plus, Square } from 'lucide-react'
import { Button } from '~/components/ui/button'
import FoodDialog from './_components/food-dialog'
import ExerciseDialog from './_components/exercise-dialog'
import { Progress } from '~/components/ui/progress'

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

				<header className='float-end flex space-x-5'>
					<FoodDialog />
					<ExerciseDialog />
				</header>
			</div>
			<div className='flex justify-between pt-5'>
				<article className='h-fit w-fit bg-slate-900/70 p-5'>
					<h2 className='mb-3'>Nutrition & Targets</h2>
					<div className='mb-2 grid grid-cols-10 space-x-10'>
						<div className='col-span-8 grid grid-flow-row space-y-2'>
							{[...Array(4)].map((_, index) => (
								<div className='flex space-x-5 border-b pb-2' key={index}>
									{[...Array(7)].map((_, index2) => (
										<span
											className='rounded-md bg-slate-800 px-4 py-5'
											key={index2}
										></span>
									))}
								</div>
							))}
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
				<aside className=''>
					{/* <h2 className='text-start'>Insights & Analytics</h2> */}
					<div className='flex space-x-3'>
						<article className='w-56 rounded-md bg-slate-800/50 p-4 pb-1'>
							<header className='flex flex-col space-y-1'>
								<h3>Expenditure</h3>
								<small className='text-gray-400'>Jul 14 - Now</small>
							</header>
							<span className='mb-8 mt-8 flex place-content-end'>
								<Square className='h-4 w-4 text-red-400' strokeWidth={4} />
							</span>
							<footer className='flex items-center justify-between border-t pt-1'>
								<p className='font-normal'>
									3016{' '}
									<span className='text-sm font-normal text-gray-400'>
										kcal
									</span>
								</p>
								<Button
									variant='ghost'
									className='rounded-full px-1 duration-100 ease-in-out hover:scale-110 hover:bg-transparent'
								>
									<ChevronRight />
								</Button>
							</footer>
						</article>
						<article className='w-56 rounded-md bg-slate-800/50 p-4 pb-1'>
							<header className='flex flex-col space-y-1'>
								<h3>Weight Trend</h3>
								<small className='text-gray-400'>Jul 14 - Now</small>
							</header>
							<span className='mb-8 mt-8 flex place-content-end'>
								<Circle className='h-4 w-4 text-purple-400' strokeWidth={4} />
							</span>
							<footer className='flex items-center justify-between border-t pt-1'>
								<p className='font-normal'>
									195.0{' '}
									<span className='text-sm font-normal text-gray-400'>lbs</span>
								</p>
								<Button
									variant='ghost'
									className='rounded-full px-1 duration-100 ease-in-out hover:scale-110 hover:bg-transparent'
								>
									<ChevronRight />
								</Button>
							</footer>
						</article>
					</div>
					<article className='mt-3 w-full rounded-md bg-slate-800/50 p-4 pb-1'>
						<header className='flex flex-col space-y-1'>
							<h3>Goal Progress</h3>
							<small className='text-gray-400'>Jul 14 - Now</small>
						</header>
						<Progress value={10} className='mb-8 mt-8 py-2' />
						<footer className='flex items-center justify-between border-t pt-1'>
							<p className='font-normal'>
								0{' '}
								<span className='text-sm font-normal text-gray-400'>
									days in
								</span>
							</p>
							<Button
								variant='ghost'
								className='rounded-full px-1 duration-100 ease-in-out hover:scale-110 hover:bg-transparent'
							>
								<ChevronRight />
							</Button>
						</footer>
					</article>
				</aside>
			</div>
		</section>
	)
}
