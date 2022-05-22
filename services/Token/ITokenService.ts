import { TExpirationDate } from 'interfaces/IToken'

export default interface ITokenService {
	create(
		_id: string,
		expiration?: TExpirationDate,
		secret?: string
	): string | Promise<string>

	verify(token: string, secret?: string): Promise<string>

	invalidate(token: string): Promise<void>
}
