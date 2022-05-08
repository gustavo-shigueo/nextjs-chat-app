import IError from './IError'

export default class NotAuthenticatedError extends Error implements IError {
	status = 401
	name = 'NotAuthenticated'
	message = 'Not authenticated'
}
