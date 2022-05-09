import User from 'entities/User'

type IPublicUserData = Omit<Omit<User, 'password'>, 'googleId'>

export default IPublicUserData
