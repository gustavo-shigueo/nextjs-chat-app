export default class InvalidSignInMethodError extends Error {
	constructor() {
		super(
			'No Email/Password combination associated with this user, please use social login'
		)
		this.name = 'InvalidSignInMethod'
	}
}
