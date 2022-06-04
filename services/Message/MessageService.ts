import Message from 'entities/Message'
import IMessageRepository from 'repositories/Message/IMessageRepository'
import IMessageService from './IMessageService'

export default class MessageService implements IMessageService {
	#messageRepository: IMessageRepository

	constructor(messageRepository: IMessageRepository) {
		this.#messageRepository = messageRepository
	}

	async send(
		senderId: string,
		receiverId: string,
		text: string
	): Promise<Message> {
		const message = new Message(text, senderId, receiverId)
		return this.#messageRepository.sendMessage(message)
	}

	async listMessagesBetweenUsers(
		userIdA: string,
		userIdB: string,
		cursor?: Date | undefined,
		limit?: number | undefined
	): Promise<Message[]> {
		return this.#messageRepository.listMessagesBetweenUsers(
			userIdA,
			userIdB,
			cursor,
			limit
		)
	}

	async latestMessageBetweenUsers(
		userIdA: string,
		userIdB: string
	): Promise<Message | null> {
		return this.#messageRepository.latestMessageBetweenUsers(userIdA, userIdB)
	}

	async listMessagesSentByUser(
		userId: string,
		cursor?: Date | undefined,
		limit?: number | undefined
	): Promise<Message[]> {
		return this.#messageRepository.listMessagesSentByUser(userId, cursor, limit)
	}

	async listMessagesReceivedByUser(
		userId: string,
		cursor?: Date | undefined,
		limit?: number | undefined
	): Promise<Message[]> {
		return this.#messageRepository.listMessagesReceivedByUser(
			userId,
			cursor,
			limit
		)
	}
}
