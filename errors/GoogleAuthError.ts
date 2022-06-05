import IError from './IError'

export default class GoogleAuthError extends Error implements IError {
	status = 401
	override message = 'Unable to authenticate with Google'
	override name = 'GoogleAuthError'
}
