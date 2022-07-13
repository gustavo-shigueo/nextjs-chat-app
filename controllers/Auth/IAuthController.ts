import User from 'entities/User'
import ICreateUserRequest from 'interfaces/ICreateUserRequest'

export default interface IAuthController {
	/**
	 * Creates a new user through the UserController
	 * @param {ICreateUserRequest} userData
	 * @returns {Promise<User>} The created user
	 */
	signUpWithEmailAndPassword(userData: ICreateUserRequest): Promise<User>

	/**
	 * Creates a new user through the UserController using their Google account
	 * @param {ICreateUserRequest} userData
	 * @returns {Promise<User>} The created user
	 */
	signUpWithGoogle(accessToken: string): Promise<User>

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
	signInWithGoogle(accessToken: string): Promise<User>
}
