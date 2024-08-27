import { Button } from '~/components/ui/button'

export default function NutritionGraphic() {
	return (
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
	)
}
