import type { Message } from '../schema'

export default interface IMessageRepository {
	findByChatId(chatId: Buffer, limit: number, cursor?: Date): Promise<Message[]>

	create(
		senderId: Buffer,
		chatId: Buffer,
		text: string,
		sentAt: Date
	): Promise<Message>
}
