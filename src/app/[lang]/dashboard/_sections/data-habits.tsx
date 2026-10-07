import { Circle, Square } from 'lucide-react'
import InsightsCard from '../_components/analytics/insights-card'
import ResumeStreak from '../_components/analytics/resume-streak'
import { type User } from '@clerk/nextjs/server'
import { DataAndHabitsSkeleton } from '../_components/skeletons'
import { db } from '~/server/db'
import { consumption, food } from '~/server/db/schema'
import { desc, eq } from 'drizzle-orm'
import { Suspense } from 'react'
import { Skeleton } from '~/components/ui/skeleton'
import { getDictionary } from '~/get-dictionary'
import { type Locale, i18n, pathWithLocale } from '~/i18n-config'
import { resolveUserProfile } from '~/server/user-profile'

export default async function DataAndHabits({
	user: currentUser,
	lang
}: {
	user: Promise<User | null>
	lang?: Locale
}) {
	const user = await currentUser
	if (!user) return <DataAndHabitsSkeleton />
	const userMetadata = await resolveUserProfile(user.id, user.publicMetadata)
	if (!userMetadata) return <DataAndHabitsSkeleton />

	const locale = lang && i18n.locales.includes(lang) ? lang : i18n.defaultLocale
	const dictionary = await getDictionary(locale)

	const nutritionRows = await db
		.select({
			date: consumption.createdAt,
			portion: consumption.portion,
			calories: food.kcal,
			createdAt: consumption.createdAt
		})
		.from(consumption)
		.innerJoin(food, eq(consumption.foodId, food.id))
		.where(eq(consumption.userId, user.id))
		.orderBy(desc(consumption.createdAt))

	const userCreatedAt = new Date(user.createdAt)
	const lastIndex = nutritionRows.length - 1
	const lastNutritionRow = nutritionRows[lastIndex]

	let initialDate
	if (
		!lastNutritionRow ||
		lastNutritionRow.createdAt?.getTime() >= userCreatedAt.getTime()
	)
		initialDate = userCreatedAt
	else initialDate = lastNutritionRow.createdAt

	const dateLocale = locale === 'es' ? 'es-ES' : 'en-US'
	const dateRange = `${initialDate.toLocaleDateString(dateLocale, {
		day: 'numeric',
		month: 'short'
	})} - ${dictionary.dashboard.dateRange.now}`

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

	// Localize goal for the title
	const localizedGoal =
		dictionary.settings.goalOptions[
			currentGoal as keyof typeof dictionary.settings.goalOptions
		] ?? currentGoal

	return (
		<section className='mx-auto mt-3 grid grid-cols-2 gap-3 sm:max-w-[460px] md:flex md:max-w-full md:gap-0 md:space-x-2 lg:justify-between'>
			<InsightsCard
				title={dictionary.dashboard.sections.nutrition}
				dateRange={dateRange}
				value={totalCalories}
				valueUnit={dictionary.common.units.kcal}
				className='w-full rounded-lg border p-4 pb-1 dark:bg-slate-800/50 sm:w-56 md:w-full md:max-w-xs'
				href={pathWithLocale('/diary?entries=meal', locale)}
			>
				<div className='mb-3 mt-3 flex place-content-end'>
					<Square className='h-4 w-4 text-yellow-400' strokeWidth={4} />
				</div>
			</InsightsCard>
			<Suspense fallback={<Skeleton className='h-[158px] w-full' />}>
				<ResumeStreak
					userId={user.id}
					nutritionDates={nutritionDates}
					lang={locale}
				/>
			</Suspense>
			<InsightsCard
				title={dictionary.dashboard.sections.weightGoal.replace(
					'{goal}',
					localizedGoal
				)}
				dateRange={dateRange}
				value={goalWeight}
				valueUnit={dictionary.common.units.kg}
				className='w-full rounded-lg border p-4 pb-1 dark:bg-slate-800/50 sm:w-56 md:w-full md:max-w-xs'
				href={pathWithLocale('/diary?entries=goal', locale)}
			>
				<div className='mb-3 mt-3 flex place-content-end'>
					<Circle className='h-4 w-4 text-green-400' strokeWidth={4} />
				</div>
			</InsightsCard>
		</section>
	)
}
