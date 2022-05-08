export default class User {
	public _id?: string
	public get avatarUrl(): string {
		return `https://avatars.dicebear.com/api/bottts/${this.name}.svg`
	}

	constructor(
		public name: string,
		public email: string | null,
		public password: string | null,
		public googleId: string | null = null,
		public onlineStatus: boolean = true,
		public contacts: User[] | string[] | null = []
	) {}
}
