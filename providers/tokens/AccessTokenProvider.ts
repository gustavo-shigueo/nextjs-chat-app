import { TExpirationDate } from 'interfaces/IToken'
import ITokenProvider from './ITokenProvider'
import BlocklistRepository from 'repositories/Blocklist'
import JWTTokenProvider from './JWTTokenProvider'

class AccessTokenProvider implements ITokenProvider {
	// private type: string = 'access'
	private expiration: TExpirationDate = [5, 'm']
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

const tokenProvider = new JWTTokenProvider(BlocklistRepository)
export default new AccessTokenProvider(tokenProvider)
