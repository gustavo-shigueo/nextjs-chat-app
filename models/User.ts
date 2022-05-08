import { Model, model, models, Schema } from 'mongoose'
import IUserDocument from 'interfaces/IUserDocument'
import PasswordProvider from 'providers/password'

const UserSchema = new Schema<IUserDocument>({
	name: {
		type: String,
		required: true,
		trim: true,
	},
	email: {
		type: String,
		trim: true,
		unique: true,
		required: true,
	},
	password: String,
	avatarUrl: {
		type: String,
		required: true,
	},
	googleId: {
		type: String,
		unique: true,
	},
	onlineStatus: {
		type: Boolean,
		required: true,
		default: true,
	},
	contacts: [
		{
			type: Schema.Types.ObjectId,
			ref: 'User',
		},
	],
})

UserSchema.pre('save', async function (next) {
	if (!this.isModified('password') || !this.password) return next()

	this.password = await PasswordProvider.hash(this.password)
	next()
})

const UserModel: Model<IUserDocument> = models.User || model('User', UserSchema)

export default UserModel
