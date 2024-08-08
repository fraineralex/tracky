import { FemaleIcon, MaleIcon } from '~/components/ui/icons'
import { State } from '../_actions'
import { DatePickerForm } from '~/components/ui/date-picker'

export default function PersonalInfo({ formState }: { formState: State }) {
	return (
		<section className='z-10 mx-5 flex flex-col items-center space-y-5 text-center sm:mx-auto'>
			<h1 className='font-serif text-3xl font-bold text-green-600 dark:text-green-500'>
				trac<span className='text-wood-950 dark:text-wood-100'>ky</span>
			</h1>
			{/* <p className='text-wrap max-w-md sm:text-lg text-accent-foreground'>
				Tracky is the simplest fitness tracker that helps you achieve your
				health and fitness goals effortlessly.
			</p> */}
			<article className='space-y-10'>
				<h2 className='font-display max-w-md text-3xl font-semibold transition-colors sm:text-4xl'>
					Which one is your sex?
				</h2>
				<article className='grid w-full grid-cols-1 divide-y divide-border rounded-md border border-border text-foreground md:grid-cols-2 md:divide-x'>
					<button className='flex min-h-[200px] flex-col items-center justify-center space-y-5 overflow-hidden p-5 transition-colors hover:bg-gray-200 hover:dark:bg-gray-800 md:p-10'>
						<MaleIcon className='pointer-events-none h-auto w-12 sm:w-12' />
						<p>Male</p>
					</button>
					<button className='flex min-h-[200px] flex-col items-center justify-center space-y-5 overflow-hidden p-5 transition-colors hover:bg-gray-200 hover:dark:bg-gray-800 md:p-10'>
						<FemaleIcon className='pointer-events-none h-auto w-12 sm:w-12' />
						<p>Female</p>
					</button>
				</article>
				<input type='hidden' name='sex' />
				{formState.errors?.sex ? (
					<div
						id='sex-error'
						aria-live='polite'
						className='mt-2 text-sm text-red-500'
					>
						{formState.errors.sex.map((error: string) => (
							<p key={error}>{error}</p>
						))}
					</div>
				) : null}
			</article>
			<article className='flex flex-col space-y-10 pt-5'>
				<h2 className='font-display max-w-lg text-3xl font-semibold transition-colors sm:text-4xl'>
					What is your date of birth?
				</h2>
				<div className='flex flex-col place-content-center items-center text-start'>
					<DatePickerForm />
				</div>
				<input type='hidden' name='born' />
				{formState.errors?.born ? (
					<div
						id='born-error'
						aria-live='polite'
						className='mt-2 text-sm text-red-500'
					>
						{formState.errors.born.map((error: string) => (
							<p key={error}>{error}</p>
						))}
					</div>
				) : null}
			</article>
		</section>
	)
}
