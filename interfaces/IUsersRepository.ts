import User from 'entities/User'
import IGoogleProfile from './IGoogleProfile'
import IUserDocument from './IUserDocument'

export default interface IUsersRepository {
	/**
	 * Checks if a given email is already linked to a user in the database
	 * @param {string} email
	 */
	isEmailInUse(email: string): Promise<boolean>

	/**
	 * Adds a user to the database
	 * @param {User} user
	 */
	save(user: User): Promise<User>

	/**
	 * Returns a user from the database that has the given email or null if none is found
	 * @param {string} email
	 */
	findByEmail(email: string): Promise<User | null>
	/**
	 * Returns a user from the database that has the given Google Account associated to it or null if none is found
	 * @param {IGoogleProfile} profile
	 */
	findByGoogleProfile(profile: IGoogleProfile): Promise<User | null>
	/**
	 * Returns all users from the database with the given name
	 * @param {IGoogleProfile} profile
	 */
	findByName(name: string): Promise<User[]>

	associateGoogleProfile(
		user: User,
		googleProfile: IGoogleProfile
	): Promise<User>
}
