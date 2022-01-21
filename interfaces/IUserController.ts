import User from 'entities/User'
import ICreateUserRequest from './ICreateUserRequest'
import IUserOperations from './IUserOperations'

export default interface IUserController extends IUserOperations {
	/**
	 * Creates and saves an user
	 * @param {ICreateUserRequest} userData
	 * @returns {User} The user that was created
	 */
	create(userData: ICreateUserRequest): Promise<User>
}
