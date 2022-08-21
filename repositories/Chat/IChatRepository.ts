import Chat from 'entities/Chat'

export default interface IChatRepository {
	create(chat: Chat): Promise<Chat>
	findById(id: string): Promise<Chat>
	findByParticipantId(userId: string): Promise<Chat[]>
}
