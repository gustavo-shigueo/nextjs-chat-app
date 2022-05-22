import User from 'entities/User'

const userSerializer = <T extends User>(user: T & { _id?: string }): User => {
	return {
		id: user.id ?? user._id,
		name: user.name,
		email: user.email,
		password: user.password,
		avatarUrl: user.avatarUrl,
		googleAssociated: user.googleAssociated,
		onlineStatus: user.onlineStatus,
		contacts: user.contacts,
		messagesSent: user.messagesSent,
		messagesReceived: user.messagesReceived,
	}
}

export default userSerializer
