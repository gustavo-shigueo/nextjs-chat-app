import User from 'entities/User'

export default interface IUserController {
	/**
	 * Links a user to their Google Account
	 * @param {string} userId
	 * @param {string} googleId
	 */
	associateGoogleProfile(userId: string, googleId: string): Promise<User>

	setOnlineStatus(userId: string, status: boolean): Promise<User>

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
	 * @param {string} googleId
	 */
	findByGoogleId(googleId: string): Promise<User | null>
}
