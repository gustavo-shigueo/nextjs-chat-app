import IUser from './IUser'

type IPublicUserData = Required<
	Omit<IUser, 'email' | 'googleAssociated' | 'contacts'>
>

export default IPublicUserData
