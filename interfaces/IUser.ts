import User from 'entities/User'
import IContact from './IContact'

type IUser = Required<Omit<User, 'password'>> & { contacts?: IContact[] }

export default IUser
