import GoogleProfileInterface from 'interfaces/GoogleProfileInterface'
import PublicUserData from 'interfaces/PublicUserData'
import UserDocumentInterface from 'interfaces/UserDocumentInterface'
import UserInterface from 'interfaces/UserInterface'
import UserModel from 'models/UserModel'

class UserController {
	static serializeUser(user: UserDocumentInterface): PublicUserData {
		const { _id, name, email, avatarUrl, contacts } = user
		return { _id, name, email, avatarUrl, contacts }
	}

	static findByEmail(email: string) {
		return UserModel.findOne({ email })
	}

	static async checkEmail(email: string): Promise<boolean> {
		return UserModel.exists({ email })
	}

	static async createFromEmailAndPassword({
		name,
		email,
		password,
	}: UserInterface): Promise<UserDocumentInterface> {
		const user = await UserModel.create({
			name,
			email,
			password,
			avatarUrl: `https://avatars.dicebear.com/api/bottts/${name}.svg`,
		})

		return user.save()
	}

	static async createFromGoogleProfile({
		googleId,
		name,
		email,
		imageUrl: avatarUrl,
	}: GoogleProfileInterface) {
		const user = await UserModel.create({ googleId, name, email, avatarUrl })
		return user.save()
	}

	static async findByGoogleProfile({
		googleId,
		email,
	}: GoogleProfileInterface): Promise<UserDocumentInterface> {
		const user = await UserModel.findOne({ $or: [{ email }, { googleId }] })
		return user as UserDocumentInterface
	}

	static async associateAccountWithGoogle(
		account: UserDocumentInterface,
		{ googleId }: GoogleProfileInterface
	): Promise<UserDocumentInterface> {
		account.googleId = googleId
		return account.save()
	}
}

export default UserController
