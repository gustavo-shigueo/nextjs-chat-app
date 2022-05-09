import User from 'entities/User'
import IUserOperations from 'interfaces/IUserOperations'

export default interface IUsersRepository extends IUserOperations {
	save(user: User): Promise<User>

	isEmailInUse(email: string): Promise<boolean>
}
