import 'server-only'

import { cache } from 'react'
import { clerkClient } from '@clerk/nextjs/server'
import { eq } from 'drizzle-orm'
import {
	applyProfilePatch,
	clearedClerkMetadata,
	hasHeavyMetadata,
	parseLegacyProfile
} from '~/lib/profile'
import { db } from '~/server/db'
import { userProfile } from '~/server/db/schema'
import { type UserProfile } from '~/types/profile'

function toRow(userId: string, profile: UserProfile) {
	return {
		userId,
		sex: profile.sex,
		born: profile.born,
		goal: profile.goal,
		height: profile.height,
		weights: profile.weights,
		activity: profile.activity,
		goalWeight: profile.goalWeight,
		fat: profile.fat,
		updatedAt: profile.updatedAt
	}
}

function fromRow(row: typeof userProfile.$inferSelect): UserProfile {
	return {
		sex: row.sex === 'female' ? 'female' : 'male',
		born: row.born,
		goal: row.goal,
		height: row.height,
		weights: row.weights,
		activity: row.activity,
		goalWeight: row.goalWeight,
		fat: row.fat,
		updatedAt: row.updatedAt
	}
}

async function readProfile(userId: string): Promise<UserProfile | null> {
	const rows = await db
		.select()
		.from(userProfile)
		.where(eq(userProfile.userId, userId))
		.limit(1)
	const row = rows[0]
	if (!row) return null
	return fromRow(row)
}

export async function saveUserProfile(userId: string, profile: UserProfile) {
	const row = toRow(userId, profile)
	await db
		.insert(userProfile)
		.values(row)
		.onConflictDoUpdate({
			target: userProfile.userId,
			set: {
				sex: row.sex,
				born: row.born,
				goal: row.goal,
				height: row.height,
				weights: row.weights,
				activity: row.activity,
				goalWeight: row.goalWeight,
				fat: row.fat,
				updatedAt: row.updatedAt
			}
		})
}

async function writeOnboardingFlag(userId: string, metadata?: unknown) {
	const client = await clerkClient()
	await client.users.updateUserMetadata(userId, {
		publicMetadata: clearedClerkMetadata(metadata)
	})
}

async function shrinkClerkMetadata(userId: string, metadata: unknown) {
	try {
		await writeOnboardingFlag(userId, metadata)
	} catch (error) {
		console.error('Failed to shrink Clerk public metadata', error)
	}
}

export async function markOnboardingComplete(userId: string) {
	await writeOnboardingFlag(userId)
}

/**
 * Profile history lives in Postgres. Clerk public metadata only keeps
 * `onboardingCompleted`. Existing users are copied across on first read,
 * then the large metadata keys are removed so the session cookie can shrink.
 */
export const resolveUserProfile = cache(async function resolveUserProfile(
	userId: string,
	metadata: UserPublicMetadata
): Promise<UserProfile | null> {
	try {
		const stored = await readProfile(userId)
		if (stored) {
			if (hasHeavyMetadata(metadata)) await shrinkClerkMetadata(userId, metadata)
			return stored
		}

		const legacy = parseLegacyProfile(metadata)
		if (!legacy) {
			if (hasHeavyMetadata(metadata)) {
				console.error(
					'Clerk public metadata is too large to migrate for user',
					userId
				)
			}
			return null
		}

		await saveUserProfile(userId, legacy)
		await shrinkClerkMetadata(userId, metadata)
		return legacy
	} catch (error) {
		// Keep serving the Clerk copy if tracky_user_profile is not migrated yet.
		console.error('User profile store unavailable', error)
		return parseLegacyProfile(metadata)
	}
})

export async function updateStoredProfile(
	userId: string,
	metadata: UserPublicMetadata,
	patch: Partial<UserProfile>
): Promise<UserProfile | null> {
	const current = await resolveUserProfile(userId, metadata)
	if (!current) return null
	const next = applyProfilePatch(current, patch)
	await saveUserProfile(userId, next)
	return next
}
