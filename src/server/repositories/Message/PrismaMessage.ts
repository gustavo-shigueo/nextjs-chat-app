import type { PrismaClient } from '@prisma/client'
import type { Message } from '../schema'
import type IMessageRepository from './IMessage'

export default class PrismaMessageRepository implements IMessageRepository {
	#prismaClient: PrismaClient

	public constructor(prismaClient: PrismaClient) {
		this.#prismaClient = prismaClient
	}

	public findByChatId(
		chatId: Buffer,
		limit: number,
		cursor?: Date | undefined
	): Promise<Message[]> {
		return this.#prismaClient.message.findMany({
			where: { chatId, sentAt: { lt: cursor } },
			take: limit + 1,
			orderBy: { sentAt: 'desc' },
		})
	}

	public create(
		senderId: Buffer,
		chatId: Buffer,
		text: string,
		sentAt: Date
	): Promise<Message> {
		return this.#prismaClient.message.create({
			data: {
				text,
				sentAt,
				chatId,
				senderId,
			},
		})
	}
}
