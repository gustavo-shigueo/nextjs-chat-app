import IError from './IError'

export default class InvalidCredentialsError extends Error implements IError {
	status = 401
	name = 'InvalidCredentials'
	message = 'Invalid credentials'
}
