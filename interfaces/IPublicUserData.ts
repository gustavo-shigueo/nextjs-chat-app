export default interface IPublicUserData {
	_id: string
	name: string
	email?: string
	avatarUrl?: string
	onlineStatus: boolean
	contacts?: any[]
}
