import User from 'entities/User'
import IGoogleProfile from './IGoogleProfile'

export default interface IUsersRepository {
	isEmailInUse(email: string): Promise<boolean>

	save(user: User): Promise<User>

	findById(id: string): Promise<User | null>

	findByEmail(email: string): Promise<User | null>

	findByGoogleProfile(profile: IGoogleProfile): Promise<User | null>

	findByName(name: string): Promise<User[]>

	listAll(): Promise<User[]>

	associateGoogleProfile(
		user: User,
		googleProfile: IGoogleProfile
	): Promise<User>

	setOnlineStatus(userId: string, status: boolean): Promise<User>
}
