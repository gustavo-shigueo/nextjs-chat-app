import User from './User'

export default class Message {
	public id?: string

	constructor(
		public text: string,
		public sentAt: Date = new Date(),
		public senderId: string,
		public receiverId: string,
		public sender?: User,
		public receiver?: User
	) {}
}
