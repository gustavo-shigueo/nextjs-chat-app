import type { ChatSchema } from '../../../server/api/schemas/chatSchema'

export default interface IChatService {
	createPrivateChat(creatorId: string, contactId: string): Promise<ChatSchema>

	createGroupChat(
		name: string,
		creatorId: string,
		userIds: readonly string[]
	): Promise<ChatSchema>

	findById(id: string): Promise<ChatSchema>

	findByParticipantId(participantId: string): Promise<ChatSchema[]>

	addUser(id: string, userId: string): Promise<ChatSchema>

	isUserMember(userId: string, chatId: string): Promise<boolean>
}
