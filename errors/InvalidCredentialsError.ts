import IError from './IError'

export default class InvalidCredentialsError extends Error implements IError {
	status = 401
	override name = 'InvalidCredentials'
	override message = 'Invalid credentials'
	fields = ['email', 'password']
}
