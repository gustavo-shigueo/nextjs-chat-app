import Message from 'entities/Message'

export default interface IMessageRepository {
	sendMessage(message: Message): Promise<Message>
}
