import { ChatType } from '@prisma/client'
import Chat from 'entities/Chat'

export default interface IChatController {
	create(
		creatorId: string,
		chatType: typeof ChatType.PrivateChat,
		memberIds: [string]
	): Promise<Chat>
	create(
		creatorId: string,
		chatType: typeof ChatType.GroupChat,
		memberIds: string[],
		name: string
	): Promise<Chat>

	findById(id: string): Promise<Chat>

	findByUser(participantId: string): Promise<Chat[]>
}
