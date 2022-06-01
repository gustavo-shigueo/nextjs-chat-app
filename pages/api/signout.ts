import UserController from 'controllers/User'
import revokeCredentials from 'middlewares/authentication/revokeCredentials'
import verifyCredentials from 'middlewares/authentication/verifyCredentials'
import errorSerializer from 'middlewares/serializers/errorSerializer'
import { NextApiRequest, NextApiResponse } from 'next'

const signout = async (req: NextApiRequest, res: NextApiResponse) => {
	try {
		await revokeCredentials(req, res)
		await UserController.setOnlineStatus(req.body.user.id, false)

		res.status(204).end()
	} catch (error: any) {
		errorSerializer(res, error)
	}
}

export default signout
