import IError from './IError'

export default class NotAuthenticatedError extends Error implements IError {
	status = 401
	override name = 'NotAuthenticated'
	override message = 'Not authenticated'
}
