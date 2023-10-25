import type { ChatSchema } from '../../server/api/schemas/chatSchema'
import type { MessageSchema } from '../../server/api/schemas/messageSchema'

export function sortChats(a: ChatSchema, b: ChatSchema): number {
	const lastA = a.messages.at(-1)?.sentAt ?? a.createdAt
	const lastB = b.messages.at(-1)?.sentAt ?? b.createdAt

	return lastB.valueOf() - lastA.valueOf()
}

export function appendMessageToEnd(message: MessageSchema) {
	return (chat: ChatSchema): ChatSchema => {
		return chat.id === message.chatId
			? { ...chat, messages: [...chat.messages, message] }
			: chat
	}
}

export function appendMessagesToStart(
	chatId: string,
	messages: MessageSchema[]
) {
	return (chat: ChatSchema): ChatSchema => {
		return chat.id === chatId
			? { ...chat, messages: [...messages, ...chat.messages] }
			: chat
	}
}

export type MappedChat = {
	[K in keyof ChatSchema]: K extends 'name' | 'thumbnailUrl'
		? string
		: ChatSchema[K]
}
export function mapChatNames(userId: string) {
	return (chat: ChatSchema) => {
		if (chat.chatType === 'GroupChat') {
			return chat as MappedChat
		}

		const user = chat.users?.find(user => user.id !== userId)
		return {
			...chat,
			name: user?.name ?? '',
			thumbnailUrl: user?.image ?? '',
		}
	}
}
