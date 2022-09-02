import Chat from 'entities/Chat'
import Message from 'entities/Message'
import User from 'entities/User'
import messageSerializer from './messageSerializer'
import publicUserSerializer from './publicUserSerializer'

type PrismaChat<T, U, M> = {
	[P in keyof T]: P extends 'users' ? U[] : P extends 'messages' ? M[] : T[P]
}

const chatSerializer = <T extends Chat, U extends User, M extends Message>({
	id,
	name,
	thumbnailUrl,
	chatType,
	createdAt,
	users,
	messages,
}: PrismaChat<T, U, M>): Chat => {
	return {
		id,
		name,
		thumbnailUrl,
		chatType,
		createdAt,
		users: users?.map(publicUserSerializer),
		messages: messages?.map(messageSerializer),
	}
}

export default chatSerializer
