'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useUser } from '@clerk/nextjs'
import Image from 'next/image'
import { format, isSameDay } from 'date-fns'
import { toast } from 'sonner'
import {
	Bot,
	Camera,
	Image as ImageIcon,
	Loader,
	MoreVertical,
	Send
} from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar'
import { Button } from '~/components/ui/button'
import { DialogFooter } from '~/components/ui/dialog'
import { Input } from '~/components/ui/input'
import { ScrollArea } from '~/components/ui/scroll-area'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger
} from '~/components/ui/dropdown-menu'
import { SuccessLogCard } from './success-log-card'
import type {
	DescribeImageInput,
	Message,
	PersistedMessage
} from '~/app/ai/types'
import {
	ChatMessageRecord,
	clearMessages,
	loadMessages,
	saveMessage,
	updateMessage as updateStoredMessage
} from '~/lib/chatDatabase'

export const maxDuration = 30

interface AIChatConversationProps {
	action: (messages: Message[]) => Promise<Message[]>
	placeholder: string
	instruction: string
	describeImage?: (payload: DescribeImageInput) => Promise<string>
}

const STORAGE_LIMIT_BYTES = 50 * 1024 * 1024
const CONTEXT_WINDOW = 10
const encoder = new TextEncoder()

const getMimeTypeFromDataUrl = (dataUrl: string) => {
	const match = /^data:(?<mime>[^;]+);/i.exec(dataUrl)
	return match?.groups?.mime ?? 'image/png'
}

const calculateMessageSize = (message: Message) => {
	let size = encoder.encode(message.content ?? '').length
	if (message.image?.dataUrl)
		size += encoder.encode(message.image.dataUrl).length
	if (message.successLogData) {
		size += encoder.encode(JSON.stringify(message.successLogData)).length
	}
	return size
}

const normalizeMessage = (message: Message): PersistedMessage => {
	const createdAt =
		message.createdAt ?? message.clientTime ?? new Date().toISOString()
	const withMeta: PersistedMessage = {
		...message,
		id: message.id ?? crypto.randomUUID(),
		createdAt
	}
	const sizeBytes = calculateMessageSize(withMeta)
	return { ...withMeta, sizeBytes }
}

const recordToMessage = (record: ChatMessageRecord): PersistedMessage => {
	const base: PersistedMessage = {
		id: record.id,
		createdAt: new Date(record.createdAt).toISOString(),
		role: record.role,
		content: record.content,
		successLogData: record.successLogData,
		sizeBytes: record.sizeBytes
	}
	if (record.imageDataUrl) {
		base.image = {
			dataUrl: record.imageDataUrl,
			mimeType: getMimeTypeFromDataUrl(record.imageDataUrl)
		}
	}
	const sizeBytes = record.sizeBytes ?? calculateMessageSize(base)
	return { ...base, sizeBytes }
}

const messageToRecord = (message: PersistedMessage): ChatMessageRecord => ({
	id: message.id,
	createdAt: new Date(message.createdAt).getTime(),
	role: message.role,
	content: message.content,
	imageDataUrl: message.image?.dataUrl,
	successLogData: message.successLogData,
	sizeBytes: message.sizeBytes ?? calculateMessageSize(message)
})

const sanitizeMessage = (
	message: PersistedMessage,
	keepImage: boolean
): Message => {
	const { id, createdAt, sizeBytes, ...rest } = message
	if (!keepImage && rest.image) {
		const { image, ...withoutImage } = rest
		return withoutImage as Message
	}
	return rest as Message
}

const prepareMessagesForAction = (
	messages: PersistedMessage[],
	latestImageMessageId?: string
) =>
	messages
		.slice(-CONTEXT_WINDOW)
		.map(message =>
			sanitizeMessage(message, latestImageMessageId === message.id)
		)

const getMessageDate = (message: Message) => {
	const source = message.createdAt ?? message.clientTime
	const date = source ? new Date(source) : new Date()
	return Number.isNaN(date.getTime()) ? new Date() : date
}

const formatUsage = (bytes: number) => {
	const limitMb = STORAGE_LIMIT_BYTES / (1024 * 1024)
	return `${(bytes / (1024 * 1024)).toFixed(1)} MB / ${limitMb.toFixed(0)} MB`
}

export default function AIChatConversation({
	action,
	placeholder,
	instruction,
	describeImage
}: AIChatConversationProps) {
	const { user } = useUser()
	const [conversation, setConversation] = useState<PersistedMessage[]>([])
	const [input, setInput] = useState('')
	const [loading, setLoading] = useState(false)
	const [usageBytes, setUsageBytes] = useState(0)
	const [prunedCount, setPrunedCount] = useState(0)
	const cameraInputRef = useRef<HTMLInputElement>(null)
	const galleryInputRef = useRef<HTMLInputElement>(null)
	const inputRef = useRef<HTMLInputElement>(null)
	const conversationRef = useRef<PersistedMessage[]>([])
	const scrollAnchorRef = useRef<HTMLDivElement>(null)
	const scrolledInitiallyRef = useRef(false)

	const updateConversationState = useCallback(
		(updater: (previous: PersistedMessage[]) => PersistedMessage[]) => {
			setConversation(previous => {
				const next = updater(previous)
				conversationRef.current = next
				return next
			})
		},
		[]
	)

	const applyPersistenceResult = useCallback(
		(result: { prunedIds: string[]; usageBytes: number }) => {
			setUsageBytes(result.usageBytes)
			if (result.prunedIds.length > 0) {
				updateConversationState(previous =>
					previous.filter(message => !result.prunedIds.includes(message.id))
				)
				setPrunedCount(result.prunedIds.length)
			}
		},
		[updateConversationState]
	)

	const persistMessage = useCallback(
		async (message: PersistedMessage) => {
			try {
				const result = await saveMessage(messageToRecord(message))
				applyPersistenceResult(result)
			} catch (error) {
				console.error('Error saving chat message', error)
				toast.error('Unable to save chat message locally')
			}
		},
		[applyPersistenceResult]
	)

	const appendMessages = useCallback(
		async (messagesToAppend: PersistedMessage[]) => {
			if (messagesToAppend.length === 0) return
			updateConversationState(previous => [...previous, ...messagesToAppend])
			for (const message of messagesToAppend) {
				await persistMessage(message)
			}
		},
		[persistMessage, updateConversationState]
	)

	const handleActionResponse = useCallback(
		async (response: Message[], sentLength: number) => {
			const appended = response
				.slice(sentLength)
				.filter(message => message.role === 'assistant')
			if (appended.length === 0) return
			const normalized = appended.map(normalizeMessage)
			await appendMessages(normalized)
		},
		[appendMessages]
	)

	useEffect(() => {
		let active = true
		const hydrate = async () => {
			try {
				const records = await loadMessages()
				if (!active) return
				const mapped = records.map(recordToMessage)
				updateConversationState(() => mapped)
				const usage = records.reduce(
					(total, record) => total + (record.sizeBytes ?? 0),
					0
				)
				setUsageBytes(usage)
			} catch (error) {
				console.error('Error loading chat history', error)
				toast.error('Unable to load chat history')
			}
		}
		void hydrate()
		return () => {
			active = false
		}
	}, [updateConversationState])

	useEffect(() => {
		const timer = setTimeout(() => {
			inputRef.current?.focus()
		}, 100)
		return () => clearTimeout(timer)
	}, [conversation.length])

	useEffect(() => {
		if (!scrollAnchorRef.current) return
		scrollAnchorRef.current.scrollIntoView({
			behavior: scrolledInitiallyRef.current ? 'smooth' : 'auto'
		})
		scrolledInitiallyRef.current = true
	}, [conversation.length])

	useEffect(() => {
		if (prunedCount === 0) return
		const timer = setTimeout(() => setPrunedCount(0), 4000)
		return () => clearTimeout(timer)
	}, [prunedCount])

	if (!user) return null

	const fileToDataUrl = (file: File) =>
		new Promise<string>((resolve, reject) => {
			const reader = new FileReader()
			reader.onload = () => resolve(reader.result as string)
			reader.onerror = () => reject(reader.error)
			reader.readAsDataURL(file)
		})

	const handleClearHistory = async () => {
		try {
			await clearMessages()
			updateConversationState(() => [])
			setUsageBytes(0)
			setPrunedCount(0)
			toast.success('History cleared')
		} catch (error) {
			console.error('Error clearing chat history', error)
			toast.error('Unable to clear chat history')
		}
	}

	const handleSend = async () => {
		const pendingInput = input.trim()
		if (!pendingInput || loading) return
		setLoading(true)
		setInput('')
		const userMessage = normalizeMessage({
			role: 'user',
			content: pendingInput,
			clientTime: new Date().toISOString()
		})
		try {
			await appendMessages([userMessage])
			const context = prepareMessagesForAction(conversationRef.current)
			const response = await action(context)
			await handleActionResponse(response, context.length)
		} catch (error) {
			console.error('Error sending chat message', error)
			toast.error('Unable to send message')
		} finally {
			setLoading(false)
			inputRef.current?.focus()
		}
	}

	const updateMessageContent = async (messageId: string, content: string) => {
		const current = conversationRef.current.find(
			message => message.id === messageId
		)
		if (!current || current.content === content) return
		const updated = normalizeMessage({ ...current, content })
		updateConversationState(previous =>
			previous.map(message => (message.id === messageId ? updated : message))
		)
		try {
			const result = await updateStoredMessage(messageId, {
				content,
				sizeBytes: updated.sizeBytes
			})
			setUsageBytes(result.usageBytes)
		} catch (error) {
			console.error('Error updating stored message', error)
			toast.error('Unable to update message locally')
		}
	}

	const describeImageWithTimeout = async (
		dataUrl: string,
		mimeType: string
	) => {
		if (!describeImage) return ''
		try {
			return await Promise.race([
				describeImage({ dataUrl, mimeType }),
				new Promise<string>(resolve => setTimeout(() => resolve(''), 12000))
			])
		} catch (error) {
			console.error('Error describing meal image', error)
			return ''
		}
	}

	const handleFileUpload = async (file: File, defaultMessage: string) => {
		if (loading) return
		setLoading(true)
		try {
			const dataUrl = await fileToDataUrl(file)
			const typedDescription = input.trim()
			const placeholderContent = typedDescription || defaultMessage
			setInput('')
			const placeholderMessage = normalizeMessage({
				role: 'user',
				content: placeholderContent,
				image: {
					dataUrl,
					mimeType: file.type
				},
				clientTime: new Date().toISOString()
			})
			await appendMessages([placeholderMessage])

			if (!typedDescription) {
				const caption = await describeImageWithTimeout(dataUrl, file.type)
				if (caption) {
					await updateMessageContent(placeholderMessage.id, caption)
				}
			}

			const context = prepareMessagesForAction(
				conversationRef.current,
				placeholderMessage.id
			)
			const response = await action(context)
			await handleActionResponse(response, context.length)
		} catch (error) {
			console.error('Error processing image upload', error)
			toast.error('Unable to process image')
		} finally {
			setLoading(false)
		}
	}

	const handleMediaSelection = async (
		files: FileList | null,
		defaultMessage: string
	) => {
		const file = files?.[0]
		if (!file) return
		await handleFileUpload(file, defaultMessage)
	}

	const handlePastedFiles = async (items: DataTransferItemList) => {
		const fileItem = Array.from(items).find(item => item.kind === 'file')
		if (!fileItem) return
		const file = fileItem.getAsFile()
		if (!file || !file.type.startsWith('image/')) return
		await handleFileUpload(file, 'Entry image')
	}

	const fullNameShort = `${user.firstName?.[0] ?? ''} ${user.lastName?.[0] ?? ''}.`
	const usageLabel = formatUsage(usageBytes)

	return (
		<>
			<div className='mb-2 flex items-center justify-between -mt-4'>
				<small className='text-sm text-muted-foreground'>
				Describe meals or workouts and the AI will log them.
				</small>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button type='button' variant='ghost' size='icon'>
							<MoreVertical className='h-4 w-4' />
							<span className='sr-only'>Chat options</span>
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align='end' className='w-48'>
						<DropdownMenuItem
							onSelect={() => {
								void handleClearHistory()
							}}
						>
							Clear history
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuLabel className='text-xs font-normal text-muted-foreground'>
							Storage usage: {usageLabel}
						</DropdownMenuLabel>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
			{prunedCount > 0 && (
				<div className='mb-2 inline-flex rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-900 dark:bg-amber-900/30 dark:text-amber-100'>
					Removed {prunedCount} old message{prunedCount === 1 ? '' : 's'}
				</div>
			)}
			<ScrollArea
				className={`${conversation.length > 0 ? 'h-[400px]' : 'h-[100px]'} pr-4`}
			>
				<div>
					{conversation.map((message, index) => {
						const messageDate = getMessageDate(message)
						const previous = conversation[index - 1]
						const showDivider =
							index === 0 ||
							!isSameDay(
								messageDate,
								previous ? getMessageDate(previous) : messageDate
							)
						const isUser = message.role === 'user'
						const bubbleStyles = isUser
							? 'bg-primary-foreground/50 dark:bg-primary-foreground/50 border-primary/40'
							: 'bg-muted/60 text-foreground border-border/60'
						return (
							<div key={message.id} className='mb-4'>
								{showDivider && (
									<div className='my-6 flex items-center justify-center gap-2'>
										<div className='h-px flex-1 bg-border' />
										<span className='px-6 block text-center text-xs uppercase tracking-wider text-muted-foreground whitespace-nowrap'>
											{format(messageDate, 'EEEE, MMM d')}
										</span>
										<div className='h-px flex-1 bg-border' />
									</div>
								)}
								{message.successLogData ? (
									<div className='space-y-3 rounded-2xl border border-muted-foreground/40 bg-muted/30 p-3'>
										{message.successLogData.map((data, cardIndex) => (
											<SuccessLogCard key={cardIndex} {...data} />
										))}
										<span className='block text-right text-[10px] uppercase tracking-wide text-muted-foreground'>
											{format(messageDate, 'HH:mm')}
										</span>
									</div>
								) : (
									<div
										className={`flex items-end gap-2 ${
											isUser ? 'justify-end' : 'justify-start'
										}`}
									>
										{!isUser && <Bot className='mb-1 h-5 w-5 text-green-500' />}
										<div
											className={`max-w-[80%] rounded-2xl border px-3 py-2 text-sm shadow-sm ${bubbleStyles}`}
										>
											<p className='whitespace-pre-wrap break-words'>
												{message.content}
											</p>
											{message.image && (
												<Image
													width={300}
													height={160}
													src={message.image.dataUrl}
													alt='Meal attachment'
													className='mt-3 max-h-40 w-full rounded-xl object-cover'
												/>
											)}
											<span className='mt-2 block text-right text-[10px] uppercase tracking-wide text-muted-foreground'>
												{format(messageDate, 'HH:mm')}
											</span>
										</div>
										{isUser && (
											<Avatar className='h-7 w-7'>
												<AvatarImage src={user.imageUrl} />
												<AvatarFallback>{fullNameShort}</AvatarFallback>
											</Avatar>
										)}
									</div>
								)}
							</div>
						)
					})}
					<div ref={scrollAnchorRef} />
					{loading && (
						<div className='flex items-center justify-start space-x-2 py-2 text-muted-foreground'>
							<Loader className='me-2 mt-1 animate-spin' />
							Analyzing...
						</div>
					)}
				</div>
			</ScrollArea>

			<DialogFooter>
				<div className='w-full'>
					<input
						ref={cameraInputRef}
						type='file'
						accept='image/*'
						capture='environment'
						className='hidden'
						onChange={async event => {
							await handleMediaSelection(event.target.files, 'Entry photo')
							if (event.target) event.target.value = ''
						}}
					/>
					<input
						ref={galleryInputRef}
						type='file'
						accept='image/*'
						className='hidden'
						onChange={async event => {
							await handleMediaSelection(event.target.files, 'Entry image')
							if (event.target) event.target.value = ''
						}}
					/>
					<article className='flex items-center space-x-2 self-center'>
						<div className='flex items-center space-x-1'>
							<Button
								type='button'
								variant='outline'
								size='icon'
								onClick={() => cameraInputRef.current?.click()}
								disabled={loading}
							>
								<Camera className='h-4 w-4' />
							</Button>
							<Button
								type='button'
								variant='outline'
								size='icon'
								onClick={() => galleryInputRef.current?.click()}
								disabled={loading}
							>
								<ImageIcon className='h-4 w-4' />
							</Button>
						</div>
						<Input
							ref={inputRef}
							value={input}
							onChange={e => setInput(e.target.value)}
							placeholder={placeholder}
							onPaste={event => {
								if (event.clipboardData?.items) {
									const hasFile = Array.from(event.clipboardData.items).some(
										item => item.kind === 'file'
									)
									if (hasFile) {
										event.preventDefault()
										void handlePastedFiles(event.clipboardData.items)
										return
									}
								}
							}}
							onKeyDown={event => {
								if (event.key === 'Enter') {
									event.preventDefault()
									void handleSend()
								}
							}}
							className='h-12 flex-grow'
							disabled={loading}
							autoFocus
						/>
						<Button
							type='button'
							onClick={() => {
								void handleSend()
							}}
							size='icon'
							disabled={loading}
						>
							<Send className='h-4 w-4' />
						</Button>
					</article>
					<div className='mt-1 text-xs leading-tight tracking-tight text-muted-foreground'>
						{instruction}
					</div>
				</div>
			</DialogFooter>
		</>
	)
}
