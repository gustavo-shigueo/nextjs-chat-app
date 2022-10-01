import { ChatType } from '@prisma/client'
import Chat from 'entities/Chat'
import IChatService from 'services/Chat/IChatService'
import IChatController from './IChatController'

export default class ChatController implements IChatController {
	#chatService: IChatService

	public constructor(chatService: IChatService) {
		this.#chatService = chatService
	}

	public async create(
		creatorId: string,
		chatType: ChatType,
		memberIds: string[],
		name?: string
	): Promise<Chat> {
		return chatType === ChatType.PrivateChat
			? this.#chatService.create(
					chatType,
					[creatorId, ...memberIds] as [string, string],
					null
			  )
			: this.#chatService.create(chatType, [creatorId, ...memberIds], name!)
	}

	public async findById(id: string): Promise<Chat> {
		return this.#chatService.findById(id)
	}

	public async findByUser(participantId: string): Promise<Chat[]> {
		return this.#chatService.findByParticipantId(participantId)
	}
}
