import Message from 'entities/Message'
import IMessageService from 'services/Message/IMessageService'
import IMessageController from './IMessageController'

export default class MessageController implements IMessageController {
	#messageService: IMessageService

	public constructor(messageService: IMessageService) {
		this.#messageService = messageService
	}

	public async send(
		senderId: string,
		chatId: string,
		text: string
	): Promise<Message> {
		return this.#messageService.send(senderId, chatId, text)
	}
}
