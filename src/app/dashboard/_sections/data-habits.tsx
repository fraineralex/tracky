import { Circle, Square } from 'lucide-react'
import InsightsCard from '../_components/analytics/insights-card'
import ResumeStreak from '../_components/analytics/resume-streak'
import { User } from '@clerk/nextjs/server'
import { DataAndHabitsSkeleton } from '../_components/skeletons'
import { db } from '~/server/db'
import { consumption, food } from '~/server/db/schema'
import { desc, eq } from 'drizzle-orm'
import { Suspense } from 'react'
import { Skeleton } from '~/components/ui/skeleton'

export default async function DataAndHabits({
	user: currentUser
}: {
	user: Promise<User | null>
}) {
	const user = await currentUser
	if (!user) return <DataAndHabitsSkeleton />
	const userMetadata = user.publicMetadata
	const dateRange = `${new Date(userMetadata.updatedAt).toLocaleDateString(
		'en-US',
		{
			day: 'numeric',
			month: 'short'
		}
	)} - Now`

	const nutritionRows = await db
		.select({
			date: consumption.createdAt,
			portion: consumption.portion,
			calories: food.kcal
		})
		.from(consumption)
		.innerJoin(food, eq(consumption.foodId, food.id))
		.where(eq(consumption.userId, user.id))
		.orderBy(desc(consumption.createdAt))

	const { totalCalories, nutritionDates } = nutritionRows.reduce(
		(
			acc: { totalCalories: number; nutritionDates: number[] },
			{ portion, calories, date }
		) => {
			acc.totalCalories += (Number(portion) / 100) * Number(calories)
			acc.nutritionDates.push(date.setHours(0, 0, 0, 0))
			return acc
		},
		{ totalCalories: 0, nutritionDates: [] }
	)

	const currentGoal =
		userMetadata.goal[userMetadata.goal.length - 1]?.value ?? 'maintain'
	const goalWeight =
		userMetadata.goalWeight[userMetadata.goalWeight.length - 1]?.value ?? 0

	return (
		<section className='mx-auto mt-3 grid grid-cols-2 gap-3 sm:max-w-[460px] md:flex md:max-w-full md:gap-0 md:space-x-2 lg:justify-between'>
			<InsightsCard
				title='Nutrition'
				dateRange={dateRange}
				value={totalCalories}
				valueUnit='kcal'
				className='w-full rounded-lg border p-4 pb-1 dark:bg-slate-800/50 sm:w-56 md:w-full md:max-w-xs'
				href='/diary?entries=meal'
			>
				<div className='mb-3 mt-3 flex place-content-end'>
					<Square className='h-4 w-4 text-yellow-400' strokeWidth={4} />
				</div>
			</InsightsCard>
			<Suspense fallback={<Skeleton className='h-[158px] w-full' />}>
				<ResumeStreak userId={user.id} nutritionDates={nutritionDates} />
			</Suspense>
			<InsightsCard
				title={`Weight ${currentGoal} Goal`}
				dateRange={dateRange}
				value={goalWeight}
				valueUnit='kg'
				className='w-full rounded-lg border p-4 pb-1 dark:bg-slate-800/50 sm:w-56 md:w-full md:max-w-xs'
				href='/settings'
			>
				<div className='mb-3 mt-3 flex place-content-end'>
					<Circle className='h-4 w-4 text-green-400' strokeWidth={4} />
				</div>
			</InsightsCard>
		</section>
	)
}
