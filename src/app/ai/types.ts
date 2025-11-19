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
}

export type DescribeImageInput = {
	dataUrl: string
	mimeType: string
}

