import User from 'entities/User'
import IGoogleProfile from './IGoogleProfile'

export default interface IUserOperations {
	/**
	 * Finds a user by their id
	 * @param {string} id
	 */
	findById(id: string): Promise<User | null>

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
	findByGoogleProfile(profile: IGoogleProfile): Promise<User | null>

	listAll(): Promise<User[]>

	/**
	 * Links a user to their Google Account
	 * @param {User} user
	 * @param {IGoogleProfile} profile
	 */
	associateGoogleProfile(user: User, profile: IGoogleProfile): Promise<User>

	setOnlineStatus(userId: string, status: boolean): Promise<User>
}
