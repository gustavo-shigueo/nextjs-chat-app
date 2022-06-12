import User from 'entities/User'
import IUserOperations from 'interfaces/IUserOperations'

export default interface IUsersRepository extends IUserOperations {
	create(user: User): Promise<Required<User>>

	isEmailInUse(email: string): Promise<boolean>

	/**
	 * Returns all of a user's contacts and including the last message they've
	 * sent
	 * @param id The id of the user you want to retrieve the contacts from
	 */
	listUserContacts(id: string): Promise<User[]>

	updateOne(data: Partial<User>, where: Partial<User>): Promise<User>

	addToContacts(userId: string, newContactId: string): Promise<User>
}
