import ChatTypeError from '../../../server/errors/ChatType'
import UnauthorizedError from '../../../server/errors/Unauthorized'
import type { IChatRepository } from '../../../server/repositories/Chat'
import type { IUuidSerializer } from '../../../server/serializers/Uuid'
import type { ChatSchema } from '../../../server/api/schemas/chatSchema'
import type IChatService from './IChat'

export default class ChatService implements IChatService {
	#chatRepository: IChatRepository
	#uuidSerializer: IUuidSerializer

	public constructor(
		chatRepository: IChatRepository,
		uuidSerializer: IUuidSerializer
	) {
		this.#chatRepository = chatRepository
		this.#uuidSerializer = uuidSerializer
	}

	public async createPrivateChat(
		creator: string,
		contact: string
	): Promise<ChatSchema> {
		const data = await this.#chatRepository.createPrivateChat(
			this.#uuidSerializer.toBuffer(creator),
			this.#uuidSerializer.toBuffer(contact)
		)

		return this.#uuidSerializer.deepStringify(data)
	}

	public async createGroupChat(
		name: string,
		creatorId: string,
		users: readonly string[]
	): Promise<ChatSchema> {
		const data = await this.#chatRepository.createGroupChat(
			name,
			this.#uuidSerializer.toBuffer(creatorId),
			users.map(u => this.#uuidSerializer.toBuffer(u))
		)

		return this.#uuidSerializer.deepStringify(data)
	}

	public async findById(id: string): Promise<ChatSchema> {
		const data = await this.#chatRepository.findById(
			this.#uuidSerializer.toBuffer(id)
		)

		return this.#uuidSerializer.deepStringify(data)
	}

	public async findByParticipantId(
		participantId: string
	): Promise<ChatSchema[]> {
		const data = await this.#chatRepository.findByParticipantId(
			this.#uuidSerializer.toBuffer(participantId)
		)

		return this.#uuidSerializer.deepStringify(data)
	}

	public async addUser(id: string, userId: string): Promise<ChatSchema> {
		const chat = await this.findById(id)

		if (id !== chat.creator.id) {
			throw new UnauthorizedError(
				'Only the creator of the group can add a user'
			)
		}

		if (chat.chatType !== 'GroupChat') {
			throw new ChatTypeError('You can only add aditional user to a group chat')
		}

		const data = await this.#chatRepository.addUser(
			this.#uuidSerializer.toBuffer(id),
			this.#uuidSerializer.toBuffer(userId)
		)

		return this.#uuidSerializer.deepStringify(data)
	}

	public async isUserMember(userId: string, chatId: string): Promise<boolean> {
		const chat = await this.#chatRepository.findById(
			this.#uuidSerializer.toBuffer(chatId)
		)

		const userIdBuffer = this.#uuidSerializer.toBuffer(userId)

		return chat.users?.some(u => u.id.equals(userIdBuffer)) ?? false
	}
}
