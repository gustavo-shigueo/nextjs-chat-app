import EmptyFields from 'validations/EmptyFields'
import IGoogleProfile from 'interfaces/IGoogleProfile'
import FieldLength from 'validations/FieldLength'

interface EmailPasswordPair {
	email: string
	password: string
}

export default class User {
	public _id?: string
	public email: string | null
	public password: string | null
	public googleId: string | null
	public avatarUrl: string
	public onlineStatus: boolean = true
	public contacts: User[] | string[] | null

	constructor(
		public name: string,
		emailAndPassword: EmailPasswordPair | null,
		googleProfile?: IGoogleProfile | null,
		contacts?: User[] | null
	) {
		EmptyFields({ name })

		this.contacts = contacts ?? []
		this.onlineStatus = true

		if (!emailAndPassword) {
			const { googleId, imageUrl, email } = googleProfile!
			EmptyFields({ googleId, email, imageUrl })

			this.googleId = googleId
			this.email = email
			this.avatarUrl = imageUrl
			this.password = null
			return
		}

		const { email, password } = emailAndPassword!
		EmptyFields({ email, password })
		FieldLength({ password }, 8, 32)

		this.email = email
		this.password = password
		this.avatarUrl = `https://avatars.dicebear.com/api/bottts/${this.name}.svg`
		this.googleId = null
	}
}
