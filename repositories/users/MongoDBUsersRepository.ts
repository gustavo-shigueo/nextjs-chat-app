import User from 'entities/User'
import NotFoundError from 'errors/NotFoundError'
import IGoogleProfile from 'interfaces/IGoogleProfile'
import IUsersRepository from 'interfaces/IUsersRepository'
import UserModel from 'models/User'

export default class MongoDBUsersRepository implements IUsersRepository {
	async isEmailInUse(email: string): Promise<boolean> {
		return UserModel.exists({ email })
	}

	async save(user: User): Promise<User> {
		const { _id, ...data } = user
		const u = await UserModel.create(data)
		return (await u.save()) as User
	}

	async findByEmail(email: string): Promise<User | null> {
		const user = await UserModel.findOne({ email })
		return user ? (user as User) : null
	}

	async findByName(name: string): Promise<User[]> {
		const regex = new RegExp(name, 'i')
		const users = await UserModel.find({ name: regex })
		return users as User[]
	}

	async findByGoogleProfile(profile: IGoogleProfile): Promise<User | null> {
		const { email, googleId } = profile

		const user = await UserModel.findOne({
			$or: [{ email }, { googleId }],
		})

		return user ? (user as User) : null
	}

	async associateGoogleProfile(
		user: User,
		{ googleId }: IGoogleProfile
	): Promise<User> {
		const account = await UserModel.findById(user._id)

		if (!account) throw new NotFoundError('User')

		account.googleId = googleId
		await account.save()

		return account as User
	}
}
