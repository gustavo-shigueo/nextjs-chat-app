import allowMethods from 'middlewares/allowMethods'
import revokeCredentials from 'middlewares/authentication/revokeCredentials'
import verifyCredentials from 'middlewares/authentication/verifyCredentials'
import errorSerializer from 'middlewares/serializers/errorSerializer'
import { NextApiRequest, NextApiResponse } from 'next'

const signout = async (req: NextApiRequest, res: NextApiResponse) => {
	try {
		allowMethods(req, 'POST')

		await verifyCredentials(req)
		await revokeCredentials(req, res)

		res.status(204).end()
	} catch (e: any) {
		errorSerializer(res, e)
	}
}

export default signout
