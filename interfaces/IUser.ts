import User from 'entities/User'

type IUser = Omit<User, 'password'>

export default IUser
