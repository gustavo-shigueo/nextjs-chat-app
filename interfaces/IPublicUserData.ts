import IUser from './IUser'

type IPublicUserData = Omit<IUser, 'email' | 'googleId' | 'emailVerified'>

export default IPublicUserData
