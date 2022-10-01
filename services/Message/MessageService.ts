import Message from 'entities/Message'
import InvalidCredentialsError from 'errors/InvalidCredentialsError'
import IMessageRepository from 'repositories/Message/IMessageRepository'
import IChatService from 'services/Chat/IChatService'
import IMessageService from './IMessageService'

export default class MessageService implements IMessageService {
	#messageRepository: IMessageRepository
	#chatService: IChatService

	public constructor(
		messageRepository: IMessageRepository,
		chatService: IChatService
	) {
		this.#messageRepository = messageRepository
		this.#chatService = chatService
	}

	public async send(
		senderId: string,
		chatId: string,
		text: string
	): Promise<Message> {
		const message = new Message(text, senderId, chatId)
		return this.#messageRepository.sendMessage(message)
	}

	public async findByChatId(
		userId: string,
		chatId: string,
		cursor?: Date
	): Promise<Message[]> {
		if (!this.#chatService.isUserMember(userId, chatId)) {
			throw new InvalidCredentialsError('You are not a member of this chat')
		}

		return this.#messageRepository.findByChatId(chatId, cursor)
	}
}
