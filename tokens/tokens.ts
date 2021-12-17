import RedisAllowlistInterface from 'interfaces/RedisAllowlistInterface'
import RedisBlocklistInterface from 'interfaces/RedisBlocklistInterface'
import {
	ExpirationDate,
	CreateOpaque,
	CreateJWT,
	VerifyOpaque,
	VerifyJWT,
	InvalidateOpaque,
	InvalidateJWT,
} from 'interfaces/TokenInterfaces'

export default class Token {
	protected static _secret: string
	static type: string
	static maxAge: number
	static allowlist: RedisAllowlistInterface
	static blocklist: RedisBlocklistInterface
	static expiration: ExpirationDate

	static create: CreateOpaque | CreateJWT
	static verify: VerifyOpaque | VerifyJWT
	static invalidate: InvalidateOpaque | InvalidateJWT
}
