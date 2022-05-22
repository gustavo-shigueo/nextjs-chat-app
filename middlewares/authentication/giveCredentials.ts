import { NextApiRequest, NextApiResponse } from 'next'
import { destroyCookie, setCookie } from 'nookies'
import AccessTokenProvider from 'providers/tokens/AccessTokenProvider'
import RefreshTokenProvider from 'providers/tokens/RefreshTokenProvider'

const giveCredentials = async (
	req: NextApiRequest,
	res: NextApiResponse,
	id?: string
) => {
	req.body ||= {}
	if (id) req.body.user = { id }

	const tokens = [
		AccessTokenProvider.create(req.body.user.id),
		RefreshTokenProvider.create(req.body.user.id),
	]

	const [accessToken, refreshToken] = await Promise.all(tokens)

	res.setHeader('authorization', accessToken)
	destroyCookie({ res }, process.env.NEXT_PUBLIC_COOKIE_NAME!)
	setCookie({ res }, process.env.NEXT_PUBLIC_COOKIE_NAME!, refreshToken, {
		maxAge: RefreshTokenProvider.maxAge,
		path: '/',
		httpOnly: true,
	})
}

export default giveCredentials
