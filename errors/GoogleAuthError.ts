import IError from './IError'

export default class GoogleAuthError extends Error implements IError {
	status = 401
	message = 'Unable to authenticate with Google'
	name = 'GoogleAuthError'
}
