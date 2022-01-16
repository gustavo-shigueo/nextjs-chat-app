import IPublicUserData from 'interfaces/IPublicUserData'

const userSerializer = (user: any): IPublicUserData => {
	return {
		_id: user.id,
		name: user.name,
		email: user.email,
		avatarUrl: user.avatarUrl,
		onlineStatus: user.onlineStatus,
		contacts: user.contacts,
	}
}

export default userSerializer
