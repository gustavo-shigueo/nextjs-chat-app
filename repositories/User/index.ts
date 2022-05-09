import UserModel from 'models/mongo/User'
import MongoDBUsersRepository from './MongoDBUsersRepository'

const UsersRepository = new MongoDBUsersRepository(UserModel)

export default UsersRepository
