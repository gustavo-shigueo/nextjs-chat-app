import Message from './Message'

export default class User {
	public id?: string

	constructor(
		public name: string,
		public email: string,
		public password: string | null,
		public avatarUrl: string,
		public googleAssociated: boolean = false,
		public onlineStatus: boolean = true,
		public contacts?: User[] | null,
		public messagesSent?: Message[] | null,
		public messagesReceived?: Message[] | null
	) {}
}
