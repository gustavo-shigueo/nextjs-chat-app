import ICreateUserRequest from 'interfaces/ICreateUserRequest'
import User from 'entities/User'
import IUserOperations from 'interfaces/IUserOperations'

export default interface IUserService extends IUserOperations {
	/**
	 * Creates and saves an user
	 * @param {ICreateUserRequest} userData
	 * @returns {User} The user that was created
	 */
	create(userData: ICreateUserRequest): Promise<User>
}
