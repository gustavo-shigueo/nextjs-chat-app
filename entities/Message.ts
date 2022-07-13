import { randomUUID } from "crypto";

export default class Message {
	public id: string = randomUUID()

	constructor(
		public text: string,
		public senderId: string,
		public chatId: string,
		public sentAt: Date = new Date()
	) {}
}
