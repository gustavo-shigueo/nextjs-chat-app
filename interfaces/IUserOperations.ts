import User from 'entities/User'

export default interface IUserOperations {
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
	findByGoogleAssociatedEmail(email: string): Promise<User | null>

	listAll(): Promise<User[]>
}
