import type { User } from '../schema'

export default interface IUserRepository {
	findById(id: Buffer): Promise<User>
	findByEmail(email: string): Promise<User>
	findByName(name: string): Promise<User[]>
	findContacts(id: Buffer): Promise<User[]>

	create(name: string, email: string, passwordHash: string): Promise<User>

	addContact(id: Buffer, contactId: Buffer): Promise<void>
	removeContact(id: Buffer, contactId: Buffer): Promise<void>

	searchNewContact(
		id: Buffer,
		search: string,
		limit: number,
		cursor?: Date | undefined
	): Promise<User[]>

	confirmEmail(id: Buffer): Promise<User>
	resetPassword(id: Buffer, passwordHash: string): Promise<User>
}
