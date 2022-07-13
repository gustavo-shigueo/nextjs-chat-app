import ICreateUserRequest from 'interfaces/ICreateUserRequest'
import User from 'entities/User'
export default interface IUserService {
	/**
	 * Saves an user to the database
	 * @param user
	 */
	save(user: User): Promise<User>

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
	 * Links a user to their Google Account
	 * @param {User} user
	 * @param {IGoogleProfile} profile
	 */
	associateGoogleProfile(userId: string, googleId: string): Promise<User>

	/**
	 * Sets the online status of a user
	 * @param userId
	 * @param status
	 */
	setOnlineStatus(userId: string, status: boolean): Promise<User>

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
