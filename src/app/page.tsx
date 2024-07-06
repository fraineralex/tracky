import Image from 'next/image'
import { CaloriesChart } from '~/components/landing/calories-chart'

export default function HomePage() {
	return (
		<section className='px-16'>
			<div className='grid place-items-center lg:grid-cols-3'>
				<article className='w-ful md:mt-10l col-span-2 mt-3'>
					<h2 className='font-serif text-8xl font-bold'>
						<span className='mb-2 block tracking-wide text-wood-950 dark:text-wood-100 lg:mb-6 lg:text-9xl'>
							Smart,
							<span className='block md:inline-block lg:ms-5'>simple</span>
						</span>{' '}
						<span className='block text-nowrap tracking-tight text-green-600 dark:text-green-500'>
							Fitness Tracking
						</span>
					</h2>
					<h3 className='mt-8 hidden text-pretty pe-5 text-2xl font-normal text-rose-950 dark:text-rose-50 md:block lg:text-3xl'>
						Follow your fitness journey, every step of the way
					</h3>
				</article>
				<figure className='relative z-10 max-w-96 items-center p-3 md:p-0 lg:-mt-5 lg:max-w-128'>
					<Image
						src='/home/banner.png'
						alt='banner image'
						height={534}
						width={845}
						className='h-auto w-full'
					/>
					<article className='absolute ms-32 mt-5'>
						<CaloriesChart />
					</article>
				</figure>
			</div>
		</section>
	)
}
