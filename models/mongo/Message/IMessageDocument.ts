import User from 'entities/User'
import { Document } from 'mongoose'

export default interface IMessageDocument extends Document {
	_id: string
	text: string
	sentAt: Date
	senderId: string
	receiverId: string
	sender?: User
	receiver?: User
}
