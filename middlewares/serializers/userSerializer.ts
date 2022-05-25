import User from 'entities/User'
import IUser from 'interfaces/IUser'

const userSerializer = (user: User): IUser => {
	const { password, ...userData } = user
	return userData
}

export default userSerializer
