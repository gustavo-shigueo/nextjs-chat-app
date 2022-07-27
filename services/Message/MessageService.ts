import Message from 'entities/Message'
import IMessageRepository from 'repositories/Message/IMessageRepository'
import IMessageService from './IMessageService'

export default class MessageService implements IMessageService {
	#messageRepository: IMessageRepository

	constructor(messageRepository: IMessageRepository) {
		this.#messageRepository = messageRepository
	}

	async send(senderId: string, chatId: string, text: string): Promise<Message> {
		const message = new Message(text, senderId, chatId)
		return this.#messageRepository.sendMessage(message)
	}
}
