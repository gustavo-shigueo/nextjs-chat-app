import User from 'entities/User'
import ICreateUserRequest from '../../interfaces/ICreateUserRequest'
import IGoogleProfile from '../../interfaces/IGoogleProfile'

export default interface IUserService {
	/**
	 * Creates and saves an user
	 * @param {ICreateUserRequest} userData
	 * @returns {User} The user that was created
	 */
	create(userData: ICreateUserRequest): Promise<User>

	findById(id: string): Promise<User>

	findByName(name: string): Promise<User[]>

	findByEmail(email: string): Promise<User | null>

	findByGoogleProfile(profile: IGoogleProfile): Promise<User | null>

	listAll(): Promise<User[]>

	associateGoogleProfile(user: User, profile: IGoogleProfile): Promise<User>

	setOnlineStatus(userId: string, status: boolean): Promise<User>
}
