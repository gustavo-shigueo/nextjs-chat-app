import IError from './IError'

export default class EmailAlreadyInUseError extends Error implements IError {
	status = 400
	name = 'EmailAlreadyInUse'
	message = 'Email already in use'
	fields = ['email']
}
