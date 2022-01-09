import { TExpirationDate } from './IToken'

export default interface ITokenProvider {
	// _secret: string
	// type: string
	// maxAge: number
	// list: ICacheProvider

	create(
		_id: string,
		expiration?: TExpirationDate,
		secret?: string
	): string | Promise<string>

	verify(token: string, secret?: string): Promise<string>

	invalidate(token: string): Promise<void>
	/* allowlist: IRedisAllowlist
  blocklist: IRedisBlocklist
  expiration: TExpirationDate
  create: TCreateOpaque | TCreateJWT
  verify: TVerifyOpaque | TVerifyJWT
  invalidate: TInvalidateOpaque | TInvalidateJWT */
}
