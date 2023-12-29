import type { MessageSchema } from '../../../server/api/schemas/messageSchema'

export default interface IMessageService {
	create(
		senderId: string,
		chatId: string,
		text: string,
		sentAt: Date
	): Promise<MessageSchema>

	findByChatId(
		chatId: string,
		limit: number,
		cursor?: Date
	): Promise<MessageSchema[]>
}
