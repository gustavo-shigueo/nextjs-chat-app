import User from 'entities/User'
import IPublicUserData from 'interfaces/IPublicUserData'

const userSerializer = <T extends User>(user: T): IPublicUserData => {
	return {
		_id: user._id,
		name: user.name,
		email: user.email,
		avatarUrl: user.avatarUrl,
		onlineStatus: user.onlineStatus,
		contacts: user.contacts,
	}
}

export default userSerializer
