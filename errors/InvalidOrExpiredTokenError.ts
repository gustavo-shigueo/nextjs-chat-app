import IError from './IError'

export default class InvalidOrExpiredTokenError
	extends Error
	implements IError
{
	status = 401
	name = 'InvalidOrExpiredToken'
	message = 'Invalid or expired token'
}
