export default function Loading() {
	return (
		<div className='mx-auto min-h-screen max-w-6xl px-4 text-zinc-300 md:max-w-screen-2xl md:px-8'>
			<header className='mx-auto mb-8 w-full text-center'>
				<div className='min-w-screen flex min-h-screen items-center justify-center p-5'>
					<div className='flex animate-pulse space-x-4'>
						<div className='h-10 w-10 rounded-full bg-gradient-to-tr from-green-500 to-sky-300 ' />
						<div className='h-10 w-10 rounded-full bg-gradient-to-tr from-green-500 to-sky-300 ' />
						<div className='h-10 w-10 rounded-full bg-gradient-to-tr from-green-500 to-sky-300 ' />
					</div>
				</div>
			</header>
		</div>
	)
}
