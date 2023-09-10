import messageRepository from '../../../server/repositories/Message'
import uuidSerializer from '../../../server/serializers/Uuid'
import type IMessageService from './IMessage'
import MessageService from './Message'

const messageService: IMessageService = new MessageService(
	messageRepository,
	uuidSerializer
)

export default messageService
export type { IMessageService }
