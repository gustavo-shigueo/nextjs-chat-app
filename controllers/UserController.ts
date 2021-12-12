import bcrypt from 'bcrypt'
import UserModel from 'models/UserModel'
import UserInterface from 'interfaces/UserInterface'
import EmptyFields from 'validations/EmptyFields'

class UserController {
	static async add({ name, email, password, avatarUrl }: UserInterface) {
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

		return await user.save()
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
