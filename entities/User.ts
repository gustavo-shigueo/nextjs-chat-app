import { randomUUID } from 'crypto'
import InvalidFieldError from 'errors/InvalidFieldError'

export default class User {
	public id: string = randomUUID()
	public emailVerified: boolean = false
	public onlineStatus: boolean = true

	public constructor(
		name: string,
		email: string,
		password: string,
		avatarUrl?: string,
		googleId?: null
	)
	public constructor(
		name: string,
		email: string,
		password: null,
		avatarUrl: string,
		googleId: string
	)
	public constructor(
		public name: string,
		public email: string,
		public password: string | null,
		public avatarUrl: string = `https://avatars.dicebear.com/api/bottts/${name}-${randomUUID()}.svg`,
		public googleId: string | null = null
	) {
		if (password === null && googleId === null)
			throw new InvalidFieldError('You must provide a password or a googleId', [
				'googleId',
				'avatarUrl',
			])
	}
}
