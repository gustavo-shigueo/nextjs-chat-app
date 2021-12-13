import bcrypt from 'bcrypt'
import UserInterface from 'interfaces/UserInterface'
import EmptyFields from 'validations/EmptyFields'
import GoogleProfileInterface from 'interfaces/GoogleProfileInterface'
import FieldLength from 'validations/FieldLength'
import UserDocumentInterface from 'interfaces/UserDocumentInterface'
import NotFoundError from 'errors/NotFoundError'
import InvalidSignInMethodError from 'errors/InvalidSignInMethodError'
import UserController from './UserController'
import EmailAlreadyInUseError from 'errors/EmailAlreadyInUseError'
import InvalidCredentialsError from 'errors/InvalidCredentialsError'

class AuthController {
	/**
	 * Creates a user based on email and password
	 * @param {UserInterface} data Contains user data that will be validated and saved to the database
	 * @returns {Promise<UserDocumentInterface>} The user document that was created
	 * @throws {EmptyFieldError} If not all required data is provided
	 * @throws {InvalidFieldError} If the password isn't between 8 and 32 characters
	 */
	static async signupWithEmailAndPassword(
		data: UserInterface
	): Promise<UserDocumentInterface> {
		let { name = '', email = '', password = '' } = data
		EmptyFields({ name, email, password })

		await ensureUniqueEmail(email)

		FieldLength({ password }, 8, 32)

		password = await hashPassword(password)

		return UserController.createFromEmailAndPassword({ name, email, password })
	}

	/**
	 * Finds a user and validates their credentials
	 * @param {UserInterface} data Email and password
	 * @returns {Promise<UserDocumentInterface>} The user document
	 */
	static async signinWithEmailAndPassword(
		data: UserInterface
	): Promise<UserDocumentInterface> {
		const { email = '', password = '' } = data
		EmptyFields({ email, password })

		const user = await UserController.findByEmail(email)

		if (!user) throw new NotFoundError('User')
		if (!user.password) throw new InvalidSignInMethodError()

		const validPassword = await verifyPassword(password, user.password)
		if (!validPassword) throw new InvalidCredentialsError()

		return user
	}

	/**
	 * Finds, creates or associates a user with the provided google profile data
	 * @param {GoogleProfileInterface} data Google OAuth provided data
	 * @returns {Promise<UserDocumentInterface>} User document
	 */
	static async signInWithGoogle(
		profile: GoogleProfileInterface
	): Promise<UserDocumentInterface> {
		const { googleId, name, email, imageUrl } = profile
		EmptyFields({ googleId, name, email, imageUrl })

		const account = await UserController.findByGoogleProfile(profile)

		if (account != null) {
			return account.googleId
				? account
				: await UserController.associateAccountWithGoogle(account, profile)
		}

		return await UserController.createFromGoogleProfile(profile)
	}
}

/**
 * Hashes a password with bcrypt
 * @param password Password to be hashed
 * @returns Password digest
 */
function hashPassword(password: string): Promise<string> {
	return bcrypt.hash(password, 10)
}

/**
 * Verifies the password provided by the user
 * @param password Plain text password
 * @param hash Password hash from the database
 * @returns Wheter or not the password matches the hash
 */
function verifyPassword(password: string, hash: string): Promise<boolean> {
	return bcrypt.compare(password, hash)
}

/**
 * Ensures the email isn't already in use
 * @param email Email to verify
 * @throws {EmailAlreadyInUseError} if the email is in use
 */
async function ensureUniqueEmail(email: string) {
	const emailIsInUse = await UserController.checkEmail(email)
	if (emailIsInUse) throw new EmailAlreadyInUseError()
}

export default AuthController
