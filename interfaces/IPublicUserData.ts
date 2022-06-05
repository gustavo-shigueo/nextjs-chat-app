import IUser from './IUser'

type IPublicUserData = Omit<IUser, 'email' | 'googleAssociated' | 'contacts'>

export default IPublicUserData
