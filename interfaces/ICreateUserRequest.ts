import IGoogleProfile from './IGoogleProfile'

type ICreateUserRequest =
	| {
			method: 'emailAndPassword'
			name: string
			email: string
			password: string
	  }
	| {
			method: 'google'
			googleProfile: IGoogleProfile
	  }

export default ICreateUserRequest
