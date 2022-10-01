import Message from 'entities/Message'

export default interface IMessageService {
	send(senderId: string, chatId: string, text: string): Promise<Message>
	findByChatId(
		userId: string,
		chatId: string,
		cursor?: Date
	): Promise<Message[]>
}
