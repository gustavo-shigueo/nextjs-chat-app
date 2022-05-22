import User from 'entities/User'

type IPublicUserData = Omit<User, 'password' | 'email' | 'googleAssociated'>

export default IPublicUserData
