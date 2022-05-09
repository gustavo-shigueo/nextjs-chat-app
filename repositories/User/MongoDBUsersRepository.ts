import User from 'entities/User'
import NotFoundError from 'errors/NotFoundError'
import IGoogleProfile from 'interfaces/IGoogleProfile'
import IUsersRepository from './IUserRepository'
import userSerializer from 'middlewares/serializers/userSerializer'
import UserModel from 'models/mongo/User'

export default class MongoDBUsersRepository implements IUsersRepository {
	async isEmailInUse(email: string): Promise<boolean> {
		return UserModel.exists({ email })
	}

	async save(user: User): Promise<User> {
		const { _id, ...data } = user
		const u = await UserModel.create(data)
		return userSerializer(await u.save())
	}

	async findById(id: string): Promise<User> {
		const user = await UserModel.findById(id)
		if (!user) throw new NotFoundError('User')

		return userSerializer(user)
	}

	async findByEmail(email: string): Promise<User | null> {
		const user = await UserModel.findOne({ email })

		if (!user) return null

		return userSerializer(user)
	}

	async findByName(name: string): Promise<User[]> {
		const regex = new RegExp(name, 'ig')
		const users = await UserModel.find({ name: regex })

		return users.map(user => userSerializer(user))
	}

	async findByGoogleProfile(profile: IGoogleProfile): Promise<User | null> {
		const { email, googleId } = profile

		const user = await UserModel.findOne({
			$or: [{ email }, { googleId }],
		})

		if (!user) return null

		return userSerializer(user)
	}

	async listAll(): Promise<User[]> {
		const users = await UserModel.find()
		return users.map(user => userSerializer(user))
	}

	async associateGoogleProfile(
		user: User,
		{ googleId }: IGoogleProfile
	): Promise<User> {
		const account = await UserModel.findById(user._id)

		if (!account) throw new NotFoundError('User')

		account.googleId = googleId
		await account.save()

		return userSerializer(account)
	}

	async setOnlineStatus(userId: string, status: boolean): Promise<User> {
		const user = await UserModel.findById(userId)
		if (!user) throw new NotFoundError('User')

		user.onlineStatus = status

		return userSerializer(await user.save())
	}
}
