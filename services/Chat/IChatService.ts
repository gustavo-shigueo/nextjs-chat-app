import { ChatType } from '@prisma/client'
import Chat from 'entities/Chat'

export default interface IChatService {
	create(
		chatType: typeof ChatType.PrivateChat,
		users: [string, string],
		name: null
	): Promise<Chat>
	create(
		chatType: typeof ChatType.GroupChat,
		users: string[],
		name: string
	): Promise<Chat>

	findById(id: string): Promise<Chat>

	findByParticipantId(participantId: string): Promise<Chat[]>
}
