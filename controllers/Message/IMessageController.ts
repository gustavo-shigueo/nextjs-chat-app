import Message from "entities/Message";

export default interface IMessageController {
	send(senderId: string, chatId: string, text: string): Promise<Message>
}
