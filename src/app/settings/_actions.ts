'use server'

import 'server-only'
import { auth, clerkClient, currentUser } from '@clerk/nextjs/server'

export const updatePublicMetadata = async (
	metadata: Partial<UserPublicMetadata>
) => {
	const { userId } = await auth()

	if (!userId)
		return {
			message: 'You must be logged in to update your information',
			success: false
		}

	try {
		const client = await clerkClient()
		if (metadata.weights) {
			const user = await currentUser()
			const weights = user?.publicMetadata.weights
			weights?.push(metadata.weights[0]!)
			metadata.weights = weights
		}

		await client.users.updateUserMetadata(userId, {
			publicMetadata: metadata as UserPublicMetadata
		})

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
