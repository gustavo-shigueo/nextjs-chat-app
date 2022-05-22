import { Model, model, models, Schema } from 'mongoose'
import IMessageDocument from './IMessageDocument'

const MessageSchema = new Schema<IMessageDocument>({
	text: {
		type: String,
		required: true,
		trim: true,
	},
	sentAt: {
		type: Date,
		required: true,
		default: new Date(),
	},
	sender: {
		type: Schema.Types.ObjectId,
		ref: 'User',
	},
	receiver: {
		type: Schema.Types.ObjectId,
		ref: 'User',
	},
})

const MessageModel: Model<IMessageDocument> =
	models.Message || model('Message', MessageSchema)

export default MessageModel
