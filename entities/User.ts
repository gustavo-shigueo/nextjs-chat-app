import { randomUUID } from 'crypto'

export default class User {
	#name?: string = ''

	public _id?: string
	public avatarUrl: string = ''

	public get name() {
		return this.#name
	}

	public set name(value: string | undefined) {
		this.#name = value
		const baseUrl = 'https://avatars.dicebear.com/api/bottts'
		this.avatarUrl = `${baseUrl}/${value}-${randomUUID()}.svg`
	}

	constructor(
		name: string,
		public email: string | null,
		public password: string | null,
		public googleId: string | null = null,
		public onlineStatus: boolean = true,
		public contacts: User[] | string[] | null = []
	) {
		this.name = name
	}
}
