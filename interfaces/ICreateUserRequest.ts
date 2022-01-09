import IGoogleProfile from './IGoogleProfile'

export default interface ICreateUserRequest {
	name: string
	email?: string
	password?: string
	googleProfile?: IGoogleProfile
}
