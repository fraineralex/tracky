import Image from 'next/image'
import { Chart } from '~/components/landing/chart'
import { GetStartedButton } from '~/components/landing/get-started'
import Footer from '~/components/layout/footer'
import { Button } from '~/components/ui/button'
import ExternalLink from '~/components/ui/external-link'
import { Github } from '~/components/ui/icons'

export default function HomePage() {
	return (
		<section className='grid min-h-screen grid-cols-3 place-items-center content-center lg:h-full lg:min-h-fit lg:content-normal'>
			<article className='col-span-3 flex flex-col pb-10 lg:col-span-2'>
				<h2 className='text-center font-serif text-[5.5rem] font-bold lg:text-8xl 2xl:text-[7rem]'>
					<span
						className='mb-2 block text-nowrap text-[6rem] tracking-wide text-wood-950 dark:text-wood-100 lg:mb-6 lg:text-8xl 2xl:text-9xl'
						style={{ lineHeight: 1 }}
					>
						Smart,
						<span className='block md:inline-block lg:ms-5'>simple</span>
					</span>{' '}
					<span
						className='block tracking-tight text-green-600 dark:text-green-500 md:text-nowrap'
						style={{ lineHeight: 1 }}
					>
						Fitness Tracking
					</span>
				</h2>
				<h3 className='mt-8 hidden text-pretty pe-5 text-center text-2xl font-normal text-neutral-950 dark:text-neutral-50 md:block lg:text-3xl'>
					Follow your fitness journey, every step of the way
				</h3>
				<div className='mt-10 flex h-full place-content-center items-center space-x-3 pb-10 lg:mt-20 lg:space-x-10'>
					<GetStartedButton />
					<Button
						asChild
						variant='outline'
						size='lg'
						className='group h-12 cursor-pointer border-slate-600 px-4 hover:bg-slate-300/80 dark:border-neutral-500 dark:hover:bg-neutral-600'
					>
						<ExternalLink
							className='flex items-center space-x-2'
							href='https://github.com/fraineralex/tracky'
						>
							<Github className='h-5 w-5 duration-100 ease-in-out group-hover:scale-110' />
							<i className='text-base font-medium not-italic'>Star on GitHub</i>
						</ExternalLink>
					</Button>
				</div>
			</article>
			<div className='hidden flex-col place-content-center lg:flex'>
				<figure className='z-10 max-w-96 items-center p-3 pb-0 md:p-0 lg:max-w-128'>
					<picture>
						<Image
							src='https://pub-f159aa4256dd4a64ae2f0c18d87e674e.r2.dev/banner.avif'
							alt='banner image'
							height={252}
							width={400}
							className='h-auto w-full'
							priority
							loading='eager'
							fetchPriority='high'
						/>
						<source
							srcSet='https://pub-f159aa4256dd4a64ae2f0c18d87e674e.r2.dev/banner.webp'
							type='image/webp'
						/>
					</picture>
				</figure>
				<article className='z-10 mt-1 flex min-h-40 place-content-center ps-16'>
					<Chart />
				</article>
			</div>
			<Footer className='fixed bottom-0 left-0 py-6 lg:p-6' showMadeBy />
		</section>
	)
}
