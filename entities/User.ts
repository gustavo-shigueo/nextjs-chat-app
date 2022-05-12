export default class User {
	public _id?: string

	constructor(
		public name: string,
		public email: string | null,
		public password: string | null,
		public avatarUrl: string,
		public googleAssociated: boolean = false,
		public onlineStatus: boolean = true,
		public contacts: User[] | string[] | null = []
	) {}
}
