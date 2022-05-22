import BlocklistRepository from 'repositories/Blocklist'
import JWTTokenService from 'services/Token/JWTTokenService'

const AccessTokenProvider = new JWTTokenService(
	BlocklistRepository,
	[5, 'm'],
	process.env.ACCESS_TOKEN_SECRET!
)

export default AccessTokenProvider
