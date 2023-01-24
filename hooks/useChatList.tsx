import { useMemo } from 'react'
import IChat from 'interfaces/IChat'

const mapper = (chat: IChat, userId: string | undefined) => {
	if (chat.chatType === 'GroupChat') {
		return chat as IChat & { name: string; thumbnailUrl: string }
	}

	const user = chat.users?.find(user => user.id !== userId)
	return {
		...chat,
		name: user?.name ?? '',
		thumbnailUrl: user?.avatarUrl ?? '',
	}
}

const useChatList = (
	chats: IChat[],
	search: string,
	userId: string | undefined
) => {
	const chatList = useMemo(() => {
		const mapped = chats.map(chat => mapper(chat, userId))

		if (!search) return mapped

		const regex = new RegExp(search, 'i')
		return mapped.filter(c => regex.test(c.name ?? ''))
	}, [chats, search, userId])

	return chatList
}

export default useChatList
