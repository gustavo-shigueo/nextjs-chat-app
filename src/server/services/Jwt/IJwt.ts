export interface IJwtService {
	sign(payload: string | object | Buffer): string
	verify<T>(token: string): T
	decode<T>(token: string): T
}
