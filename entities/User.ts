import Message from './Message'

export default class User {
	public id?: string

	constructor(
		public name: string,
		public email: string,
		public password: string | null | undefined,
		public avatarUrl: string,
		public googleAssociated: boolean = false,
		public onlineStatus: boolean = true,
		public contacts?: User[] | null | undefined,
		public messagesSent?: Message[] | null | undefined,
		public messagesReceived?: Message[] | null | undefined
	) {}
}
