'use cache'

import { desc, eq } from 'drizzle-orm'
import { Dumbbell, HandPlatter } from 'lucide-react'
import {
	unstable_cacheLife as cacheLife,
	unstable_cacheTag as cacheTag
} from 'next/cache'
import { Card } from '~/components/ui/card'
import { calculateStreak } from '~/lib/calculations'
import { db } from '~/server/db'
import { exercise } from '~/server/db/schema'

export default async function ResumeStreak({
	userId,
	nutritionDates
}: {
	userId: string
	nutritionDates: number[]
}) {
	cacheLife('hours')
	cacheTag('resume-streak')

	const exerciseDates = await db
		.select({ date: exercise.createdAt })
		.from(exercise)
		.where(eq(exercise.userId, userId))
		.orderBy(desc(exercise.createdAt))

	const foodStreak = calculateStreak(nutritionDates)
	const exerciseStreak = calculateStreak(
		exerciseDates.map(({ date }) => date.setHours(0, 0, 0, 0))
	)
	return (
		<Card className='order-last col-span-2 w-full rounded-lg border py-1 dark:bg-slate-800/50 md:order-none md:max-w-xs'>
			<div className='grid grid-cols-2 gap-6 p-6'>
				<header className='flex flex-col items-center gap-2'>
					<HandPlatter className='h-8 w-8 text-primary' />
					<div className='text-2xl font-bold'>{foodStreak}</div>
					<p className='text-wrap text-center text-sm text-muted-foreground lg:text-nowrap'>
						Food Streak
					</p>
				</header>
				<footer className='flex flex-col items-center gap-2'>
					<Dumbbell className='h-8 w-8 text-primary' />
					<div className='text-2xl font-bold'>{exerciseStreak}</div>
					<p className='text-wrap text-center text-sm text-muted-foreground lg:text-nowrap'>
						Exercise Streak
					</p>
				</footer>
			</div>
		</Card>
	)
}
