import { currentUser } from '@clerk/nextjs/server'
import { desc, eq } from 'drizzle-orm'
import { Dumbbell, HandPlatter } from 'lucide-react'
import { Card } from '~/components/ui/card'
import { calculateStreak } from '~/lib/calculations'
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

	const foodStreak = calculateStreak(
		foodDates.map(({ createdAt }) => new Date(createdAt.setHours(0, 0, 0, 0)))
	)
	const exerciseStreak = calculateStreak(
		exerciseDates.map(
			({ createdAt }) => new Date(createdAt.setHours(0, 0, 0, 0))
		)
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
