import User from 'entities/User'
import EmailAlreadyInUseError from 'errors/EmailAlreadyInUseError'
import ICreateUserRequest from 'interfaces/ICreateUserRequest'
import IGoogleProfile from 'interfaces/IGoogleProfile'
import IUserController from 'interfaces/IUserController'
import IUsersRepository from 'interfaces/IUsersRepository'
import UsersRepository from 'repositories/users'
import EmptyFields from 'validations/EmptyFields'
import FieldLength from 'validations/FieldLength'

class UserController implements IUserController {
	constructor(private usersRepository: IUsersRepository) {}

	async create(userData: ICreateUserRequest): Promise<User> {
		const { name, googleProfile } = userData
		const emailAndPassword = googleProfile
			? null
			: { email: userData.email ?? '', password: userData.password ?? '' }

		EmptyFields({ name, ...(googleProfile ? {} : emailAndPassword) })

		if (!googleProfile && emailAndPassword) {
			const { email, password } = emailAndPassword

			if (await this.usersRepository.isEmailInUse(email)) {
				throw new EmailAlreadyInUseError()
			}

			FieldLength({ password }, 8, 32)
		}

		const user = new User(name, emailAndPassword, googleProfile)
		return this.usersRepository.save(user)
	}

	async findById(id: string): Promise<User | null> {
		return this.usersRepository.findById(id)
	}

	async findByName(name: string) {
		return this.usersRepository.findByName(name)
	}

	async findByEmail(email: string) {
		return this.usersRepository.findByEmail(email)
	}

	async findByGoogleProfile(profile: IGoogleProfile) {
		return this.usersRepository.findByGoogleProfile(profile)
	}

	async listAll(): Promise<User[]> {
		return this.usersRepository.listAll()
	}

	async associateGoogleProfile(user: User, profile: IGoogleProfile) {
		return this.usersRepository.associateGoogleProfile(user, profile)
	}

	async setOnlineStatus(userId: string, status: boolean): Promise<User> {
		return this.usersRepository.setOnlineStatus(userId, status)
	}
}

export default new UserController(UsersRepository)
