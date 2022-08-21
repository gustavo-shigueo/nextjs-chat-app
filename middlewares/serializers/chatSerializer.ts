import Chat from 'entities/Chat'
import User from 'entities/User'
import publicUserSerializer from './publicUserSerializer'

type PrismaChat<T, U> = { [P in keyof T]: P extends 'users' ? U[] : T[P] }

const chatSerializer = <T extends Chat, U extends User>(
	chat: PrismaChat<T, U>
): Chat => {
	return {
		id: chat.id,
		name: chat.name,
		thumbnailUrl: chat.thumbnailUrl,
		chatType: chat.chatType,
		createdAt: chat.createdAt,
		users: chat.users?.map(publicUserSerializer),
		messages: chat.messages,
	}
}

export default chatSerializer
