import { Document } from 'mongoose'

export default interface IUserDocument extends Document {
	_id: string
	name: string
	email?: string
	password?: string
	avatarUrl: string
	googleId?: string
	onlineStatus: boolean
	contacts?: any[]
}
