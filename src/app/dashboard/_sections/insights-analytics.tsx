import { Circle, Square } from 'lucide-react'
import { Progress } from '~/components/ui/progress'
import InsightsCard from '../_components/analytics/insights-card'
import { User } from '@clerk/nextjs/server'
import { InsightsAndAnaliticsSkeleton } from '../_components/skeletons'
import { db } from '~/server/db'
import { exercise } from '~/server/db/schema'
import { asc, eq } from 'drizzle-orm'
import { formatDistance } from 'date-fns'

export default async function InsightsAndAnalitics({
	user: currentUser
}: {
	user: Promise<User | null>
}) {
	const user = await currentUser
	if (!user) return <InsightsAndAnaliticsSkeleton />
	const { goal, goalWeight, weights } = user.publicMetadata
	const currentWeight = weights[weights.length - 1]?.value ?? 0
	const currentGoalWeight = goalWeight[goalWeight.length - 1]?.value ?? 0
	const currentGoal = goal[goal.length - 1]?.value ?? 'maintain'
	const initialWeight = weights[0]?.value ?? 0
	const userCreatedAt = new Date(user.createdAt)

	let goalProgress: number = 0

	if (currentGoal === 'maintain') {
		if (currentWeight === currentGoalWeight) goalProgress = 100
		else
			goalProgress =
				100 -
				Math.abs(
					((currentWeight - currentGoalWeight) /
						(initialWeight - currentGoalWeight)) *
						100
				)
	}

	if (currentGoal === 'gain') {
		if (currentWeight <= initialWeight) goalProgress = 0
		else if (currentWeight >= currentGoalWeight) goalProgress = 100
		else
			goalProgress =
				((currentWeight - initialWeight) /
					(currentGoalWeight - initialWeight)) *
				100
	}

	if (currentGoal === 'lose') {
		if (currentWeight >= initialWeight) goalProgress = 0
		else if (currentWeight <= currentGoalWeight) goalProgress = 100
		else
			goalProgress =
				((initialWeight - currentWeight) /
					(initialWeight - currentGoalWeight)) *
				100
	}

	const exerciseEnergyBurned = await db
		.select({ burned: exercise.energyBurned, createdAt: exercise.createdAt })
		.from(exercise)
		.where(eq(exercise.userId, user.id))
		.orderBy(asc(exercise.createdAt))

	const expenditure = exerciseEnergyBurned.reduce((acc, { burned }) => {
		return acc + Number(burned)
	}, 0)

	const initialDate =
		exerciseEnergyBurned[0] &&
		exerciseEnergyBurned[0].createdAt.getTime() < userCreatedAt.getTime()
			? exerciseEnergyBurned[0].createdAt
			: userCreatedAt
	const dateRange = `${initialDate.toLocaleDateString('en-US', {
		day: 'numeric',
		month: 'short'
	})} - Now`

	const userDaysIn = `${formatDistance(new Date(), initialDate)} in`

	return (
		<aside className='mx-auto md:mx-0 lg:w-full'>
			<div className='flex gap-x-3 lg:w-full'>
				<InsightsCard
					title='Expenditure'
					dateRange={dateRange}
					value={expenditure}
					valueUnit='kcal'
					href='/diary?entries=exercise'
				>
					<span className='mb-8 mt-8 flex place-content-end'>
						<Square className='h-4 w-4 text-red-400' strokeWidth={4} />
					</span>
				</InsightsCard>
				<InsightsCard
					title='Scale Weight'
					dateRange={dateRange}
					value={currentWeight}
					valueUnit='kg'
					href='/diary?entries=weight'
				>
					<span className='mb-8 mt-8 flex place-content-end'>
						<Circle className='h-4 w-4 text-purple-400' strokeWidth={4} />
					</span>
				</InsightsCard>
			</div>
			<InsightsCard
				title='Goal Progress'
				dateRange={dateRange}
				timeDistance={userDaysIn}
				valueUnit=''
				className='mt-3 rounded-lg border p-4 pb-1 dark:bg-slate-800/50'
				href='/diary?entries=goal'
			>
				<Progress value={goalProgress} className='mb-6 mt-6 h-4' />
			</InsightsCard>
		</aside>
	)
}
