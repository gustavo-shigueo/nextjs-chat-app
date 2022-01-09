import { NextApiRequest, NextApiResponse } from 'next'
import { setCookie } from 'nookies'
import AccessToken from 'providers/tokens/AccessTokenProvider'
import RefreshToken from 'providers/tokens/RefreshTokenProvider'

const giveCredentials = async (
	req: NextApiRequest,
	res: NextApiResponse,
	id?: string
) => {
	if (id) req.body.user = { id }

	const tokens = [
		AccessToken.create(req.body.user.id),
		RefreshToken.create(req.body.user.id),
	]

	const [accessToken, refreshToken] = await Promise.all(tokens)

	res.setHeader('authorization', `Bearer: ${accessToken}`)
	setCookie({ res }, process.env.NEXT_PUBLIC_COOKIE_NAME!, refreshToken, {
		maxAge: RefreshToken.maxAge,
	})
}

export default giveCredentials
