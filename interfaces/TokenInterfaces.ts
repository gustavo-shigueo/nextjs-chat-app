import RedisAllowlistInterface from './RedisAllowlistInterface'
import RedisBlocklistInterface from './RedisBlocklistInterface'

export interface TokenPayload {
	_id: string
}

export type ExpirationDate = [number, 's' | 'm' | 'h' | 'd']

export type CreateOpaque = (
	_id: string,
	expiration: ExpirationDate,
	allowlist: RedisAllowlistInterface
) => Promise<string>

export type VerifyOpaque = (
	token: string,
	allowlist: RedisAllowlistInterface
) => Promise<string>

export type InvalidateOpaque = (
	token: string,
	allowlist: RedisAllowlistInterface
) => void

export type CreateJWT = (
	_id: string,
	expiration: ExpirationDate,
	secret: string
) => string

export type VerifyJWT = (
	token: string,
	blocklist: RedisBlocklistInterface,
	secret: string
) => Promise<string>

export type InvalidateJWT = (
	token: string,
	blocklist: RedisBlocklistInterface
) => Promise<void>
