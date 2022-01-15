import refreshCredentials from 'middlewares/authentication/refreshCredentials'
import errorSerializer from 'middlewares/serializers/errorSerializer'
import { NextApiRequest, NextApiResponse } from 'next'

const refreshToken = async (req: NextApiRequest, res: NextApiResponse) => {
	try {
		await refreshCredentials(req, res)
		res.status(204).end()
	} catch (e: any) {
		errorSerializer(res, e)
	}
}

export default refreshToken
