import EventEmitter from 'events'
import type { CallSchema } from '../schemas/callSchema'
import type { ChatSchema } from '../schemas/chatSchema'
import type { SignalSchema } from '../schemas/signalDataSchema'

interface CallEvents {
	start: (chat: ChatSchema, call: CallSchema) => void
	userJoin: (call: CallSchema, userId: string) => void
	userLeave: (call: CallSchema, userId: string) => void
	userReject: (callerId: string) => void

	rtcOffer: (offer: SignalSchema, from: string, to: string) => void
	rtcAnswer: (answer: SignalSchema, from: string, to: string) => void
}

declare interface CallEventEmitter {
	on<T extends keyof CallEvents>(event: T, listener: CallEvents[T]): this
	off<T extends keyof CallEvents>(event: T, listener: CallEvents[T]): this
	once<T extends keyof CallEvents>(event: T, listener: CallEvents[T]): this
	emit<T extends keyof CallEvents>(
		event: T,
		...args: Parameters<CallEvents[T]>
	): boolean
}

class CallEventEmitter extends EventEmitter {}

export default CallEventEmitter
