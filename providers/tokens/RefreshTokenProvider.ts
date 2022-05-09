import { TExpirationDate } from 'interfaces/IToken'
import ITokenProvider from './ITokenProvider'
import AllowlistRepository from 'repositories/Allowlist'
import OpaqueTokenProvider from './OpaqueTokenProvider'

class RefreshTokenProvider implements ITokenProvider {
	// private type: string = 'access'
	public maxAge: number = 3_600 * 24 * 7
	private expiration: TExpirationDate = [7, 'd']
	private _secret: string = process.env.ACCESS_TOKEN_SECRET!

	constructor(private tokenProvider: ITokenProvider) {}

	async create(_id: string): Promise<string> {
		return this.tokenProvider.create(_id, this.expiration, this._secret)
	}

	async verify(token: string): Promise<string> {
		return this.tokenProvider.verify(token, this._secret)
	}

	async invalidate(token: string): Promise<void> {
		this.tokenProvider.invalidate(token)
	}
}

const tokenProvider = new OpaqueTokenProvider(AllowlistRepository)
export default new RefreshTokenProvider(tokenProvider)
