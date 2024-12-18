'use server'

import 'server-only'
import { clerkClient, currentUser } from '@clerk/nextjs/server'
import { calculateBodyFat } from '~/lib/calculations'
import { revalidatePath, revalidateTag } from 'next/cache'

export const updatePublicMetadata = async (
	metadata: Partial<UserPublicMetadata>
) => {
	const user = await currentUser()

	if (!user)
		return {
			message: 'You must be logged in to update your information',
			success: false
		}

	try {
		const client = await clerkClient()
		if (metadata.born || metadata.height || metadata.sex || metadata.weights) {
			const publicMetadata = user.publicMetadata
			if (metadata.weights) {
				const weights = publicMetadata.weights
				weights.push(metadata.weights[0]!)
				metadata.weights = weights
				publicMetadata.weights = weights
			}

			if (metadata.born) publicMetadata.born = metadata.born
			if (metadata.height) {
				const height = publicMetadata.height
				height.push(metadata.height[0]!)
				metadata.height = height
				publicMetadata.height = height
			}
			if (metadata.sex) publicMetadata.sex = metadata.sex

			const fat = {
				value: calculateBodyFat(publicMetadata),
				date: new Date().toISOString().split('T')[0] as string
			}
			metadata.fat?.push(fat)
		}

		await client.users.updateUserMetadata(user.id, {
			publicMetadata: metadata as UserPublicMetadata
		})

		revalidatePath('/settings')
		revalidateTag('nutrition')

		if (!metadata.goalWeight) {
			revalidatePath('/dashboard')
			revalidatePath('/food')
		}
		return {
			message: 'Information updated successfully',
			success: true
		}
	} catch (error) {
		console.error('Error updating metadata', error)
		return {
			message: 'Error updating your information, please try again later.',
			success: false
		}
	}
}
