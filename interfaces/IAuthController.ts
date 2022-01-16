import User from 'entities/User'
import ICreateUserRequest from './ICreateUserRequest'
import IGoogleProfile from './IGoogleProfile'

export default interface IAuthController {
	/**
	 * Creates a new user through the UserController
	 * @param {ICreateUserRequest} userData
	 * @returns {Promise<User>} The created user
	 */
	signUp(userData: ICreateUserRequest): Promise<User>

	/**
	 * Attempts to sign a user in through email and password
	 * @param {string} email
	 * @param {string} password
	 * @returns {Promise<User>} The signed in user
	 */
	signInWithEmailAndPassword(email: string, password: string): Promise<User>

	/**
	 * Attempts to sign a user in through their Google Account
	 * @param {IGoogleProfile} googleProfile
	 * @returns {Promise<User>} The signed in user
	 */
	signInWithGoogle(googleProfile: IGoogleProfile): Promise<User>
}
