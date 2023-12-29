import EventEmitter from 'events'
import type { ChatSchema } from '../schemas/chatSchema'

interface ChatEvents {
	create: (chat: ChatSchema) => void
	addmember: (chat: ChatSchema) => void
}

declare interface ChatEventEmitter {
	on<T extends keyof ChatEvents>(event: T, listener: ChatEvents[T]): this
	off<T extends keyof ChatEvents>(event: T, listener: ChatEvents[T]): this
	once<T extends keyof ChatEvents>(event: T, listener: ChatEvents[T]): this
	emit<T extends keyof ChatEvents>(
		event: T,
		...args: Parameters<ChatEvents[T]>
	): boolean
}

class ChatEventEmitter extends EventEmitter {}

export default ChatEventEmitter
