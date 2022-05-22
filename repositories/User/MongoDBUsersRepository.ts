import User from 'entities/User'
import NotFoundError from 'errors/NotFoundError'
import IUsersRepository from './IUserRepository'
import userSerializer from 'middlewares/serializers/userSerializer'
import UserModel from 'models/mongo/User'

class MongoDBUsersRepository implements IUsersRepository {
	#model: typeof UserModel

	constructor(model: typeof UserModel) {
		this.#model = model
	}

	async isEmailInUse(email: string): Promise<boolean> {
		return !!this.#model.exists({ email })
	}

	async save(user: User): Promise<User> {
		const { id, ...data } = user
		const u = await this.#model.create(data)
		return userSerializer(await u.save())
	}

	async findById(id: string): Promise<User> {
		const user = await this.#model.findById(id)
		if (!user) throw new NotFoundError('User')

		return userSerializer(user)
	}

	async findByEmail(email: string): Promise<User | null> {
		const user = await this.#model.findOne({ email })

		if (!user) return null

		return userSerializer(user)
	}

	async findByName(name: string): Promise<User[]> {
		const users = await this.#model.find({
			name: { $regex: name, $options: 'ig' },
		})

		return users.map(userSerializer)
	}

	async findByGoogleAssociatedEmail(email: string): Promise<User | null> {
		const user = await this.#model.findOne({
			$and: [{ email }, { googleAssociated: true }],
		})

		if (!user) return null

		return userSerializer(user)
	}

	async listAll(): Promise<User[]> {
		const users = await this.#model.find()
		return users.map(user => userSerializer(user))
	}

	async associateGoogleProfile(user: User): Promise<User> {
		const account = await this.#model.findById(user.id)

		if (!account) throw new NotFoundError('User')

		account.googleAssociated = true
		await account.save()

		return userSerializer(account)
	}

	async setOnlineStatus(userId: string, status: boolean): Promise<User> {
		const user = await this.#model.findById(userId)
		if (!user) throw new NotFoundError('User')

		user.onlineStatus = status

		return userSerializer(await user.save())
	}
}

export default new MongoDBUsersRepository(UserModel)
