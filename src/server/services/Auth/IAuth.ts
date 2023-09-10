import type { UserSchema } from '../../../server/api/schemas/userSchema'

export interface Credentials {
	name?: string
	email: string
	password: string
}

export default interface IAuthService {
	authenticate(credentials: Omit<Credentials, 'name'>): Promise<UserSchema>
	signup(credentials: Required<Credentials>): Promise<void>
}
