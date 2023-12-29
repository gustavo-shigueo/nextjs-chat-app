import type { UserSchema } from '../../../server/api/schemas/userSchema'

export default interface IUserService {
	findById(id: string): Promise<UserSchema>
	findByEmail(email: string): Promise<UserSchema>
	findByName(name: string): Promise<UserSchema[]>
	findContacts(id: string): Promise<UserSchema[]>

	addContact(id: string, contactId: string): Promise<void>
	removeContact(id: string, contactId: string): Promise<void>

	searchNewContact(
		id: string,
		search: string,
		limit: number,
		cursor?: Date | undefined
	): Promise<UserSchema[]>
}
