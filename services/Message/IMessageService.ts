import Message from 'entities/Message'

export default interface IMessageService {
	send(senderId: string, chatId: string, text: string): Promise<Message>
}
