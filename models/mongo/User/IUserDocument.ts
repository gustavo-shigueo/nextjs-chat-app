import Message from 'entities/Message'
import User from 'entities/User'
import { Document } from 'mongoose'

export default interface IUserDocument extends Document {
	_id: string
	name: string
	email: string
	password: string | null
	avatarUrl: string
	googleAssociated: boolean
	onlineStatus: boolean
	contacts: User[] | null
	messagesSent: Message[] | null
	messagesReceived: Message[] | null
}
