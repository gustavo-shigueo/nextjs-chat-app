import IUser from './IUser'

type IPublicUserData = Omit<IUser, 'email' | 'googleId' | 'contacts'>

export default IPublicUserData
