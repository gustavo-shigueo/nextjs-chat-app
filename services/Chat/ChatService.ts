import { ChatType } from '@prisma/client'
import { randomUUID } from 'crypto'
import Chat from 'entities/Chat'
import InvalidFieldError from 'errors/InvalidFieldError'
import IChatRepository from 'repositories/Chat/IChatRepository'
import IChatService from './IChatService'

export default class ChatService implements IChatService {
	#chatRepository: IChatRepository

	public constructor(chatRepository: IChatRepository) {
		this.#chatRepository = chatRepository
	}

	public async create(
		chatType: ChatType,
		users: string[],
		name: string | null
	): Promise<Chat> {
		if (users.length < 2) {
			throw new InvalidFieldError('Chat must have at least two users', [
				'users',
			])
		}

		if (chatType === ChatType.PrivateChat && users.length !== 2) {
			throw new InvalidFieldError('Private chat must have exactly two users', [
				'chatType',
				'users',
			])
		}

		if (chatType === ChatType.GroupChat && !name) {
			throw new InvalidFieldError('Group chat must have a name', ['name'])
		}

		const thumbnailUrl =
			chatType !== ChatType.PrivateChat
				? `https://avatars.dicebear.com/api/bottts/${name}-${randomUUID()}.svg`
				: null

		const chat =
			chatType === ChatType.PrivateChat
				? new Chat(chatType, null, users as [string, string], null)
				: new Chat(chatType, name!, users, thumbnailUrl!)

		return this.#chatRepository.create(chat)
	}

	public async findById(id: string): Promise<Chat> {
		return this.#chatRepository.findById(id)
	}

	public async findByParticipantId(participantId: string): Promise<Chat[]> {
		return this.#chatRepository.findByParticipantId(participantId)
	}

	public async isUserMember(userId: string, chatId: string): Promise<boolean> {
		const chat = await this.#chatRepository.findById(chatId)
		return chat.users?.some(u => u.id === userId) ?? false
	}
}
