import chatRepository from '../../../server/repositories/Chat'
import uuidSerializer from '../../../server/serializers/Uuid'
import ChatService from './Chat'
import type IChatService from './IChat'

const chatService: IChatService = new ChatService(
	chatRepository,
	uuidSerializer
)

export default chatService
export type { IChatService }
