import type { IMessageRepository } from '../../../server/repositories/Message'
import type { IUuidSerializer } from '../../../server/serializers/Uuid'
import type { MessageSchema } from '../../../server/api/schemas/messageSchema'
import type IMessageService from './IMessage'

export default class MessageService implements IMessageService {
	#messageRepository: IMessageRepository
	#uuidSerializer: IUuidSerializer

	public constructor(
		messageRepository: IMessageRepository,
		uuidService: IUuidSerializer
	) {
		this.#messageRepository = messageRepository
		this.#uuidSerializer = uuidService
	}

	public async create(
		senderId: string,
		chatId: string,
		text: string,
		sentAt: Date
	): Promise<MessageSchema> {
		const message = await this.#messageRepository.create(
			this.#uuidSerializer.toBuffer(senderId),
			this.#uuidSerializer.toBuffer(chatId),
			text,
			sentAt
		)

		return this.#uuidSerializer.deepStringify(message)
	}

	public async findByChatId(
		chatId: string,
		limit: number,
		cursor?: Date | undefined
	): Promise<MessageSchema[]> {
		const messages = await this.#messageRepository.findByChatId(
			this.#uuidSerializer.toBuffer(chatId),
			limit,
			cursor
		)

		return this.#uuidSerializer.deepStringify(messages)
	}
}
