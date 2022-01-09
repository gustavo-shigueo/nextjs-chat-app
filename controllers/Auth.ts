import User from 'entities/User'
import InvalidCredentialsError from 'errors/InvalidCredentialsError'
import InvalidSignInMethodError from 'errors/InvalidSignInMethodError'
import NotFoundError from 'errors/NotFoundError'
import IAuthController from 'interfaces/IAuthController'
import ICreateUserRequest from 'interfaces/ICreateUserRequest'
import IGoogleProfile from 'interfaces/IGoogleProfile'
import IPasswordProvider from 'interfaces/IPasswordProvider'
import IUserController from 'interfaces/IUserController'
import PasswordProvider from 'providers/password'
import EmptyFields from 'validations/EmptyFields'
import UserController from './User'

class AuthController implements IAuthController {
	constructor(
		private userController: IUserController,
		private passwordProvider: IPasswordProvider
	) {}

	async signup(user: ICreateUserRequest): Promise<User> {
		return await this.userController.create(user)
	}

	async signInWithEmailAndPassword(
		email: string,
		password: string
	): Promise<User> {
		EmptyFields({ email, password })

		const user = await this.userController.findByEmail(email)

		if (!user) throw new NotFoundError('User')
		if (!user.password) throw new InvalidSignInMethodError()

		const valid = await this.passwordProvider.verify(password, user.password)
		if (!valid) throw new InvalidCredentialsError()

		return user
	}

	async signInWithGoogle(profile: IGoogleProfile): Promise<User> {
		const { googleId, name, email, imageUrl } = profile
		EmptyFields({ googleId, name, email, imageUrl })

		const account = await this.userController.findByGoogleProfile(profile)

		if (account) {
			return account.googleId
				? account
				: this.userController.associateGoogleProfile(account, profile)
		}

		const userData: ICreateUserRequest = {
			name,
			email,
			googleProfile: profile,
		}

		return this.userController.create(userData)
	}
}

export default new AuthController(UserController, PasswordProvider)
