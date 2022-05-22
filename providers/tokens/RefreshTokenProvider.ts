import AllowlistRepository from 'repositories/Allowlist'
import OpaqueTokenService from 'services/Token/OpaqueTokenService'

const RefreshTokenProvider = new OpaqueTokenService(AllowlistRepository, [
	7,
	'd',
])

export default RefreshTokenProvider
