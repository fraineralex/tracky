import Image from 'next/image'

export default function HomePage() {
	return (
		<section className='mt-10 flex flex-col items-center justify-center px-16'>
			<div className='grid grid-flow-col'>
				<article className='w-full'>
					<h2 className='font-serif text-8xl font-semibold'>
						<span className='text-wood-950 dark:text-wood-100 mb-6 block text-nowrap text-[7rem]'>
							Accurate, simple
						</span>
						<span className='block text-green-600 dark:text-green-500'>
							Fitness Tracking
						</span>
					</h2>
					<h3 className='mt-8 text-3xl font-normal text-rose-950 dark:text-rose-50'>
						Follow your fitness journey, every step of the way
					</h3>
				</article>
				<figure className='flex items-center'>
					<Image
						src='/home/banner.png'
						alt='banner image'
						height={512}
						width={834}
						className='h-full w-full object-cover'
					/>
				</figure>
			</div>
		</section>
	)
}
