'use client'

import { ExerciseCard } from './exercise-card'
import React from 'react'
import { EXERCISE_ICONS } from '~/constants'

import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator
} from '~/components/ui/breadcrumb'
import { SlashIcon } from '@radix-ui/react-icons'
import ExerciseForm from './exercise-form'
import { ExerciseCategories as ExerciseCategoryList } from '~/types'
import { toast } from 'sonner'
import { Gym } from '~/components/ui/icons'

export default function ExerciseCategories({
	categories
}: {
	categories: ExerciseCategoryList
}) {
	const [selectedCategory, setSelectedCategory] = React.useState<
		ExerciseCategoryList[number] | null
	>(null)
	const [success, setSuccess] = React.useState(true)

	const handleCategorySelect =
		(category: ExerciseCategoryList[number] | null) => () => {
			setSelectedCategory(category)
		}

	const handleFormClose = (message: string) => {
		if (success) {
			setSelectedCategory(null)
			setSuccess(false)
			toast.success(message)
		}
	}

	return (
		<section className='md:px-5'>
			{selectedCategory && (
				<Breadcrumb className='py-2'>
					<BreadcrumbList>
						<BreadcrumbItem>
							<BreadcrumbLink
								onClick={() => setSelectedCategory(null)}
								className='cursor-pointer'
							>
								Categories
							</BreadcrumbLink>
						</BreadcrumbItem>
						<BreadcrumbSeparator>
							<SlashIcon />
						</BreadcrumbSeparator>
						<BreadcrumbItem>
							<BreadcrumbPage>{selectedCategory.name}</BreadcrumbPage>
						</BreadcrumbItem>
					</BreadcrumbList>
				</Breadcrumb>
			)}
			{!selectedCategory && (
				<div className='grid grid-cols-3 md:grid-cols-4 gap-2 md:gap-4 py-2 md:py-10'>
					{categories &&
						categories.map(category => (
							<ExerciseCard
								key={category.name}
								title={category.name}
								Icon={EXERCISE_ICONS[category.name] || Gym}
								handleCategorySelect={handleCategorySelect(category)}
							/>
						))}
				</div>
			)}
			<ExerciseForm
				selectedCategory={selectedCategory}
				handleFormClose={handleFormClose}
				handleCategorySelect={setSelectedCategory}
			/>
		</section>
	)
}
