import { PrismaClient } from '@prisma/client'
import Message from 'entities/Message'
import IMessageRepository from './IMessageRepository'

export default class PrismaMessageRepository implements IMessageRepository {
	#client: PrismaClient

	public constructor(client: PrismaClient) {
		this.#client = client
	}

	public async sendMessage(message: Message): Promise<Message> {
		return this.#client.message.create({ data: message })
	}

	public async findByChatId(chatId: string, cursor?: Date): Promise<Message[]> {
		return this.#client.message.findMany({
			where: {
				chatId,
				sentAt: { lt: cursor },
			},
			orderBy: { sentAt: 'desc' },
			take: 50,
		})
	}
}
