import IError from './IError'

export default class EmailAlreadyInUseError extends Error implements IError {
	status = 400
	override name = 'EmailAlreadyInUse'
	override message = 'Email already in use'
	fields = ['email']
}
