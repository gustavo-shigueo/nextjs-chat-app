import User from './User'

export default class Message {
	public id?: string

	constructor(
		public text: string,
		public senderId: string,
		public receiverId: string,
		public sentAt?: Date,
		public sender?: User,
		public receiver?: User
	) {}
}
