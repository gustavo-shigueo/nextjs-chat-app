import User from 'entities/User'
import { Document } from 'mongoose'

export default interface IUserDocument extends Document {
	_id: string
	name: string
	email: string | null
	password: string | null
	avatarUrl: string
	googleAssociated: boolean
	onlineStatus: boolean
	contacts: User[] | string[] | null
}
