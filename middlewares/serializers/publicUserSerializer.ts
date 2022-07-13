import User from 'entities/User'
import IPublicUserData from 'interfaces/IPublicUserData'
import userSerializer from './userSerializer'

const publicUserSerializer = <T extends User>(user: T): IPublicUserData => {
	const { email, googleId, ...publicData } = userSerializer(user)
	return publicData
}

export default publicUserSerializer
