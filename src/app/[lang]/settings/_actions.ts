'use server'

import 'server-only'
import { currentUser } from '@clerk/nextjs/server'
import { revalidatePath, updateTag } from 'next/cache'
import { updateStoredProfile } from '~/server/user-profile'
import { type UserProfile } from '~/types/profile'

export const updateUserProfile = async (patch: Partial<UserProfile>) => {
	const user = await currentUser()

	if (!user)
		return {
			message: 'You must be logged in to update your information',
			success: false
		}

	try {
		const saved = await updateStoredProfile(user.id, user.publicMetadata, patch)
		if (!saved) {
			return {
				message: 'Error updating your information, please try again later.',
				success: false
			}
		}

		updateTag('nutrition')
		revalidatePath('/settings')

		if (!patch.goalWeight) {
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
