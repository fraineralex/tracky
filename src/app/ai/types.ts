import { SuccessLogData } from '~/types'

export interface Message {
	role: 'user' | 'assistant'
	content: string
	image?: {
		dataUrl: string
		mimeType: string
	}
	successLogData?: SuccessLogData[]
	clientTime?: string
	id?: string
	createdAt?: string
	sizeBytes?: number
}

export type DescribeImageInput = {
	dataUrl: string
	mimeType: string
}

export type PersistedMessage = Message & {
	id: string
	createdAt: string
}

