'use client'

import Dexie, { Table } from 'dexie'
import { SuccessLogData } from '~/types'

const STORAGE_LIMIT_BYTES = 50 * 1024 * 1024
const encoder = new TextEncoder()

export type ChatMessageRecord = {
	id: string
	createdAt: number
	role: 'user' | 'assistant'
	content: string
	imageDataUrl?: string
	successLogData?: SuccessLogData[]
	sizeBytes: number
}

class ChatDatabase extends Dexie {
	messages!: Table<ChatMessageRecord, string>

	constructor() {
		super('trackyChat')
		this.version(1).stores({
			messages: 'id, createdAt'
		})
	}
}

const db = new ChatDatabase()

const computeRecordSize = (record: ChatMessageRecord) => {
	if (typeof record.sizeBytes === 'number') return record.sizeBytes
	let size = encoder.encode(record.content ?? '').length
	if (record.imageDataUrl) size += encoder.encode(record.imageDataUrl).length
	if (record.successLogData) {
		size += encoder.encode(JSON.stringify(record.successLogData)).length
	}
	return size
}

export const loadMessages = async () =>
	db.messages.orderBy('createdAt').toArray()

export const getUsageBytes = async () => {
	let total = 0
	await db.messages.each(message => {
		total += computeRecordSize(message)
	})
	return total
}

export const pruneMessages = async (
	limitBytes = STORAGE_LIMIT_BYTES
): Promise<{ prunedIds: string[]; usageBytes: number }> => {
	const ordered = await db.messages.orderBy('createdAt').toArray()
	let usageBytes = ordered.reduce(
		(total, record) => total + computeRecordSize(record),
		0
	)
	const prunedIds: string[] = []
	for (const record of ordered) {
		if (usageBytes <= limitBytes) break
		await db.messages.delete(record.id)
		usageBytes -= computeRecordSize(record)
		prunedIds.push(record.id)
	}
	return { prunedIds, usageBytes }
}

export const saveMessage = async (message: ChatMessageRecord) => {
	await db.messages.put(message)
	return pruneMessages()
}

export const updateMessage = async (
	id: string,
	updates: Partial<Pick<ChatMessageRecord, 'content' | 'sizeBytes'>>
) => {
	await db.messages.update(id, updates)
	return { usageBytes: await getUsageBytes() }
}

export const clearMessages = async () => {
	await db.messages.clear()
	return { usageBytes: 0 }
}

