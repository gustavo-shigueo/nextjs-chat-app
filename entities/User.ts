export default class User {
	public _id?: string

	constructor(
		public name: string,
		public email: string | null,
		public password: string | null,
		public googleId: string | null = null,
		public avatarUrl: string,
		public onlineStatus: boolean = true,
		public contacts: User[] | string[] | null = []
	) {}
}
