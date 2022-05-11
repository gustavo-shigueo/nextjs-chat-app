import allowMethods from 'middlewares/allowMethods'
import refreshCredentials from 'middlewares/authentication/refreshCredentials'
import errorSerializer from 'middlewares/serializers/errorSerializer'
import { NextApiRequest, NextApiResponse } from 'next'

const refreshToken = async (req: NextApiRequest, res: NextApiResponse) => {
	try {
		allowMethods(req, 'POST')

		await refreshCredentials(req, res)
		res.status(204).end()
	} catch (error: any) {
		errorSerializer(res, error)
	}
}

export default refreshToken
