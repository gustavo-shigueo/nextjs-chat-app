import User from 'entities/User'

const userSerializer = <T extends User>(user: T): User => {
	return {
		_id: user._id,
		name: user.name,
		email: user.email,
		password: user.password,
		avatarUrl: user.avatarUrl,
		googleId: user.googleId,
		onlineStatus: user.onlineStatus,
		contacts: user.contacts,
	}
}

export default userSerializer
