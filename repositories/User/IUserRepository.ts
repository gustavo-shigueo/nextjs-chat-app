import User from 'entities/User'
import IUserOperations from 'interfaces/IUserOperations'

export default interface IUsersRepository extends IUserOperations {
	create(user: User): Promise<User>

	isEmailInUse(email: string): Promise<boolean>

	updateOne(data: Partial<User>, where: Partial<User>): Promise<User>
}
