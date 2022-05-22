import { Model, model, models, Schema } from 'mongoose'
import IUserDocument from './IUserDocument'

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
	googleAssociated: {
		type: Boolean,
		required: true,
		default: false,
	},
	onlineStatus: {
		type: Boolean,
		required: true,
		default: true,
	},
	messagesSent: [
		{
			type: Schema.Types.ObjectId,
			ref: 'Message',
		},
	],
	messagesReceived: [
		{
			type: Schema.Types.ObjectId,
			ref: 'Message',
		},
	],
	contacts: [
		{
			type: Schema.Types.ObjectId,
			ref: 'User',
		},
	],
})

const UserModel: Model<IUserDocument> = models.User || model('User', UserSchema)

export default UserModel
