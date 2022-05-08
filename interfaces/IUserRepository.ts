import User from 'entities/User'
import IUserOperations from './IUserOperations'

export default interface IUsersRepository extends IUserOperations {
	isEmailInUse(email: string): Promise<boolean>

	save(user: User): Promise<User>
}
