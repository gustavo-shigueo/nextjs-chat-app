export default class Message {
	public id?: string

	constructor(
		public text: string,
		public senderId: string,
		public receiverId: string,
		public sentAt?: Date
	) {}
}
