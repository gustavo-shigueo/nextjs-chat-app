import IError from './IError'

export default class InvalidOrExpiredTokenError
	extends Error
	implements IError
{
	status = 401
	override name = 'InvalidOrExpiredToken'

	constructor(message: string = 'Invalid or expired token') {
		super(message)
	}
}
