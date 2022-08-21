import { PrismaClient } from '@prisma/client'
import NotFoundError from 'errors/NotFoundError'
import Chat from 'entities/Chat'
import chatSerializer from 'middlewares/serializers/chatSerializer'
import IChatRepository from './IChatRepository'
import { PrismaRepository } from 'prisma/client'

export default class PrismaChatRepository
	extends PrismaRepository
	implements IChatRepository
{
	#client: PrismaClient

	public constructor(client: PrismaClient) {
		super()
		this.#client = client
	}

	public async create({ userIds, messageIds, ...chat }: Chat): Promise<Chat> {
		await this.ensureUniqueId(chat)

		const created = await this.#client.chat.create({
			data: {
				...chat,
				users:
					(userIds ?? []).length > 0
						? { connect: userIds?.map(id => ({ id })) }
						: undefined,
				messages:
					(messageIds ?? []).length > 0
						? { connect: messageIds?.map(id => ({ id })) }
						: undefined,
			},
			include: { users: true, messages: true },
		})

		return chatSerializer(created)
	}

	public async findById(id: string): Promise<Chat> {
		const found = await this.#client.chat.findUnique({
			where: { id },
			include: { users: true, messages: true },
		})

		if (!found) throw new NotFoundError('Chat')

		return chatSerializer(found)
	}

	public async findByParticipantId(userId: string): Promise<Chat[]> {
		const chats = await this.#client.chat.findMany({
			where: {
				users: { some: { id: userId } },
			},
			include: { users: true, messages: true },
		})

		return chats.map(chatSerializer)
	}
}
