import { SignInButton } from '@clerk/nextjs'
import Image from 'next/image'
import { CaloriesChart } from '~/components/landing/calories-chart'
import Footer from '~/components/layout/footer'
import { Button } from '~/components/ui/button'

export default function HomePage() {
	return (
		<section className='h-full px-16'>
			<div className='grid h-full place-items-center lg:grid-cols-3'>
				<article className='w-ful col-span-2 flex flex-col place-items-center pb-10'>
					<h2 className='text-center font-serif text-[7rem] font-bold'>
						<span className='mb-2 block tracking-wide text-wood-950 dark:text-wood-100 lg:mb-6 lg:text-9xl'>
							Smart,
							<span className='block md:inline-block lg:ms-5'>simple</span>
						</span>{' '}
						<span
							className='block text-nowrap tracking-tight text-green-600 dark:text-green-500'
							style={{ lineHeight: 1 }}
						>
							Fitness Tracking
						</span>
					</h2>
					<h3 className='mt-8 hidden text-pretty pe-5 text-center text-2xl font-normal text-rose-950 dark:text-rose-50 md:block lg:text-3xl'>
						Follow your fitness journey, every step of the way
					</h3>
					<div className='mt-20 flex h-full place-content-center items-center space-x-10'>
						<Button
							variant='default'
							size='lg'
							className='h-12 text-lg font-semibold hover:bg-white/70'
							asChild
						>
							<SignInButton>Get started</SignInButton>
						</Button>
						<Button
							variant='outline'
							size='lg'
							className='h-12 border-gray-500 text-lg font-semibold'
						>
							Watch a demo
						</Button>
					</div>
				</article>
				<div className='flex flex-col place-content-center'>
					<figure className='z-10 max-w-96 items-center p-3 md:p-0 lg:-mt-5 lg:max-w-128'>
						<Image
							src='/home/banner.png'
							alt='banner image'
							height={534}
							width={845}
							className='h-auto w-full'
						/>
					</figure>
					<article className='mt-3 flex place-content-center ps-16'>
						<CaloriesChart />
					</article>
				</div>
			</div>
			<Footer className='fixed bottom-0 left-0 p-6' />
		</section>
	)
}
