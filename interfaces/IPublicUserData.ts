import User from 'entities/User'

type IPublicUserData = Omit<Omit<User, 'password'>, 'googleId'>

export default IPublicUserData

/*export default interface IPublicUserData {
	_id: string
	name: string
	email?: string
	avatarUrl?: string
	onlineStatus: boolean
	contacts?: any[]
}*/
