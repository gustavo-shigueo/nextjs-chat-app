import IError from './IError'

export default class InvalidSignInMethodError extends Error implements IError {
	status = 401
	override name = 'InvalidSignInMethod'
	override message =
		'No Email/Password combination associated with this user, please use social login'
}
