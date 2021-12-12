import { Model, model, models, Schema } from 'mongoose'
import UserInterface from 'interfaces/UserInterface'
const emailRegex =
	/[a-z0-9!#$%&'*+/=?^_‘{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_‘{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/

const UserSchema = new Schema<UserInterface>({
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
		validate: {
			validator(v: string) {
				return emailRegex.test(v)
			},
		},
	},
	password: {
		type: String,
		minlength: [8, 'Password must be between 8 and 32 characters long'],
		maxlength: [32, 'Password must be between 8 and 32 characters long'],
	},
	avatarUrl: {
		type: String,
		required: true,
	},
	googleId: {
		type: String,
		unique: true,
	},
	contacts: [
		{
			type: Schema.Types.ObjectId,
			ref: 'User',
		},
	],
})

const UserModel: Model<UserInterface> =
	models.User || model<UserInterface>('User', UserSchema)

export default UserModel
