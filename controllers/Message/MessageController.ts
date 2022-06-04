import IMessageService from 'services/Message/IMessageService'
import IMessageController from './IMessageController'

export default class MessageController implements IMessageController {
	#messageService: IMessageService

	constructor(messageService: IMessageService) {
		this.#messageService = messageService
	}
}
