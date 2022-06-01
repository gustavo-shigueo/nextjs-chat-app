import User from 'entities/User'
import ICreateUserRequest from 'interfaces/ICreateUserRequest'
import IUser from 'interfaces/IUser'
import IUserOperations from 'interfaces/IUserOperations'

export default interface IUserController extends IUserOperations {
	/**
	 * Creates and saves an user
	 * @param {ICreateUserRequest} userData
	 * @returns {IUser} The user that was created
	 */
	create(userData: ICreateUserRequest): Promise<IUser>

	/**
	 * Links a user to their Google Account
	 * @param {User} user
	 * @param {IGoogleProfile} profile
	 */
	associateGoogleProfile(userId: string): Promise<User>

	setOnlineStatus(userId: string, status: boolean): Promise<User>
}
