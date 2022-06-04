import { PrismaClient } from '@prisma/client'
import Message from 'entities/Message'
import IMessageRepository from './IMessageRepository'

export default class PrismaMessageRepository implements IMessageRepository {
	#client: PrismaClient

	constructor(client: PrismaClient) {
		this.#client = client
	}

	async listMessagesBetweenUsers(
		userIdA: string,
		userIdB: string,
		cursor: Date = new Date(),
		limit: number = 50
	): Promise<Message[]> {
		return this.#client.message.findMany({
			where: {
				sentAt: {
					lte: cursor,
				},
				OR: [
					{ senderId: userIdA, receiverId: userIdB },
					{ senderId: userIdB, receiverId: userIdA },
				],
			},
			orderBy: {
				sentAt: 'desc',
			},
			take: limit,
		})
	}

	async latestMessageBetweenUsers(
		userIdA: string,
		userIdB: string
	): Promise<Message | null> {
		return this.#client.message.findFirst({
			where: {
				OR: [
					{ senderId: userIdA, receiverId: userIdB },
					{ senderId: userIdB, receiverId: userIdA },
				],
			},
			orderBy: {
				sentAt: 'desc',
			},
		})
	}

	async listMessagesSentByUser(
		userId: string,
		cursor: Date = new Date(),
		limit: number = 30
	): Promise<Message[]> {
		return this.#client.message.findMany({
			where: {
				senderId: userId,
				sentAt: {
					lte: cursor,
				},
			},
			orderBy: { sentAt: 'desc' },
			take: limit,
		})
	}

	async listMessagesReceivedByUser(
		userId: string,
		cursor: Date = new Date(),
		limit: number = 30
	): Promise<Message[]> {
		return this.#client.message.findMany({
			where: {
				receiverId: userId,
				sentAt: {
					lte: cursor,
				},
			},
			orderBy: { sentAt: 'desc' },
			take: limit,
		})
	}

	async sendMessage(message: Message): Promise<Message> {
		const { sentAt, id, receiver, sender, ...data } = message
		return this.#client.message.create({ data })
	}
}
