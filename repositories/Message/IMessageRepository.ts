import Message from 'entities/Message'

export default interface IMessageRepository {
	listMessagesBetweenUsers(
		userIdA: string,
		userIdB: string,
		cursor?: Date,
		limit?: number
	): Promise<Message[]>

	latestMessageBetweenUsers(
		userIdA: string,
		userIdB: string
	): Promise<Message | null>

	listMessagesSentByUser(
		userId: string,
		cursor?: Date,
		limit?: number
	): Promise<Message[]>

	listMessagesReceivedByUser(
		userId: string,
		cursor?: Date,
		limit?: number
	): Promise<Message[]>

	sendMessage(message: Message): Promise<Message>
}
