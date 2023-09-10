import EventEmitter from 'events'
import type { ChatSchema } from '../schemas/chatSchema'
import type { MessageSchema } from '../schemas/messageSchema'

interface MessageEvents {
	send: (chat: ChatSchema, message: MessageSchema) => void
}

declare interface MessageEventEmitter {
	on<T extends keyof MessageEvents>(event: T, listener: MessageEvents[T]): this
	off<T extends keyof MessageEvents>(event: T, listener: MessageEvents[T]): this
	once<T extends keyof MessageEvents>(
		event: T,
		listener: MessageEvents[T]
	): this
	emit<T extends keyof MessageEvents>(
		event: T,
		...args: Parameters<MessageEvents[T]>
	): boolean
}

class MessageEventEmitter extends EventEmitter {}

export default MessageEventEmitter
