import { PrismaClient } from '@prisma/client'
import Message from 'entities/Message'
import IMessageRepository from './IMessageRepository'

export default class PrismaMessageRepository implements IMessageRepository {
	#client: PrismaClient

	constructor(client: PrismaClient) {
		this.#client = client
	}

	async sendMessage(message: Message): Promise<Message> {
		const { sentAt, id, ...data } = message
		return this.#client.message.create({ data })
	}
}
