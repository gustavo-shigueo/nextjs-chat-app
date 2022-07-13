import User from 'entities/User'

const userMapper = <T extends User>(user: T): User => {
	return {
		id: user.id,
		name: user.name,
		email: user.email,
		password: user.password,
		avatarUrl: user.avatarUrl,
		googleId: user.googleId,
		onlineStatus: user.onlineStatus,
		emailVerified: user.emailVerified,
	}
}

export default userMapper
