import type { ChatSchema } from '../../server/api/schemas/chatSchema'
import type { MessageSchema } from '../../server/api/schemas/messageSchema'

export function sortChats(a: ChatSchema, b: ChatSchema): number {
	const lastA = a.messages.at(-1)
	const lastB = b.messages.at(-1)

	if (lastA && lastB) {
		return lastB.sentAt.valueOf() - lastA.sentAt.valueOf()
	}

	if (lastA) {
		return b.createdAt.valueOf() - lastA.sentAt.valueOf()
	}

	if (lastB) {
		return lastB.sentAt.valueOf() - a.createdAt.valueOf()
	}

	return b.createdAt.valueOf() - a.createdAt.valueOf()
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

export function mapChatNames(userId: string) {
	return (chat: ChatSchema) => {
		if (chat.chatType === 'GroupChat') {
			return chat as ChatSchema & { name: string; thumbnailUrl: string }
		}

		const user = chat.users?.find(user => user.id !== userId)
		return {
			...chat,
			name: user?.name ?? '',
			thumbnailUrl: user?.image ?? '',
		}
	}
}
