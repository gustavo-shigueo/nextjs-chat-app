import User from 'entities/User'

export default interface IUsersRepository {
	/**
	 * Adds a user to the database
	 * @param user
	 */
	create(user: User): Promise<User>

	/**
	 * Checls whether or not an email is already in use
	 * @param email
	 */
	isEmailInUse(email: string): Promise<boolean>

	/**
	 * Updates an user from tha database
	 * @param data The new data to update the user with
	 * @param where Filter to find the user to be updated
	 */
	updateOne(
		data: Partial<Omit<User, 'id'>>,
		where: Partial<Pick<User, 'id' | 'email' | 'googleId'>>
	): Promise<User>

	/**
	 * Finds a user by their id
	 * @param {string} id
	 */
	findById(id: string): Promise<User>

	/**
	 * Finds all the users with the given name
	 * @param {string} name
	 */
	findByName(name: string): Promise<User[]>

	/**
	 * Finds a user by their email
	 * @param {string} email
	 */
	findByEmail(email: string): Promise<User | null>

	/**
	 * Finds a user through their Google Account
	 * @param {IGoogleProfile} profile
	 */
	findByGoogleId(googleId: string): Promise<User | null>

	/**
	 * Returns all the users in the database
	 */
	listAll(): Promise<User[]>
}
