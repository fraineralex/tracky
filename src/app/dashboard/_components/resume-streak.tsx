import { currentUser } from '@clerk/nextjs/server'
import { desc, eq } from 'drizzle-orm'
import { Dumbbell, HandPlatter } from 'lucide-react'
import { getStreakNumber } from '~/lib/utils'
import { db } from '~/server/db'
import { consumption, exercise } from '~/server/db/schema'

export default async function ResumeStreak() {
	const user = await currentUser()
	if (!user) return null
	const foodDates = await db
		.select({ createdAt: consumption.createdAt })
		.from(consumption)
		.where(eq(consumption.userId, user.id))
		.orderBy(desc(consumption.createdAt))

	const exerciseDates = await db
		.select({ createdAt: exercise.createdAt })
		.from(exercise)
		.where(eq(exercise.userId, user.id))
		.orderBy(desc(exercise.createdAt))

	const foodStreak = getStreakNumber(
		foodDates.map(({ createdAt }) => createdAt)
	)
	const exerciseStreak = getStreakNumber(
		exerciseDates.map(({ createdAt }) => createdAt)
	)
	return (
		<article className='w-full max-w-xs rounded-lg border bg-slate-200/50 py-1 dark:bg-slate-800/50 2xl:max-w-sm'>
			<div className='grid grid-cols-2 gap-6 p-6'>
				<header className='flex flex-col items-center gap-2'>
					<HandPlatter className='h-8 w-8 text-primary' />
					<div className='text-2xl font-bold'>{foodStreak}</div>
					<p className='text-sm text-muted-foreground'>Food Streak</p>
				</header>
				<footer className='flex flex-col items-center gap-2'>
					<Dumbbell className='h-8 w-8 text-primary' />
					<div className='text-2xl font-bold'>{exerciseStreak}</div>
					<p className='text-sm text-muted-foreground'>Exercise Streak</p>
				</footer>
			</div>
		</article>
	)
}
