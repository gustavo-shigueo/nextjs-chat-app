import bcrypt from 'bcrypt'
import UserModel from 'models/UserModel'
import UserInterface from 'interfaces/UserInterface'
import EmptyFields from 'validations/EmptyFields'
import GoogleProfileInterface from 'interfaces/GoogleProfileInterface'

class UserController {
	static async signupWithEmailAndPassword({
		name,
		email,
		password,
		avatarUrl,
	}: UserInterface) {
		const [hasEmptyFields, emptyFieldErrors] = EmptyFields({
			name,
			email,
			password,
		})

		if (hasEmptyFields) throw emptyFieldErrors
		await ensureUniqueEmail(email!)

		const hashedPassword = await hashPassword(password!)
		avatarUrl ||= `https://avatars.dicebear.com/api/bottts/${name}.svg`

		const user = await UserModel.create({
			name,
			email,
			password: hashedPassword,
			avatarUrl,
		})

		await user.save()

		return user
	}

	static async signinWithEmailAndPassword({ email, password }: UserInterface) {
		const [hasEmptyFields, emptyFieldErrors] = EmptyFields({ email, password })
		if (hasEmptyFields) throw emptyFieldErrors

		const user = await UserModel.findOne({ email })

		if (!user) throw new Error('User not found')
		if (!user.password) {
			throw new Error(
				'Email/Password combination associated with this user, please use social login'
			)
		}

		const validPassword = await bcrypt.compare(password!, user.password!)
		if (!validPassword) throw new Error('Invalid credentials')

		return user
	}

	static async signInWithGoogle({
		googleId,
		name,
		email,
		imageUrl,
	}: GoogleProfileInterface) {
		const [hasEmptyFields, emptyFieldErrors] = EmptyFields({
			googleId,
			name,
			email,
			imageUrl,
		})

		if (hasEmptyFields) throw emptyFieldErrors

		const account = await UserModel.findOne({
			$or: [{ googleId }, { email }],
		})

		if (account != null) {
			if (account.googleId) return account

			account.googleId = googleId
			await account.save()
			return account
		}

		const user = await UserModel.create({
			googleId,
			name,
			email,
			avatarUrl: imageUrl,
		})

		await user.save()

		return user
	}
}

function hashPassword(password: string) {
	return bcrypt.hash(password, 10)
}

async function ensureUniqueEmail(email: string) {
	const emailIsInUse = await UserModel.exists({ email })
	if (emailIsInUse) throw new Error('This e-mail is already in use')
}

export default UserController
