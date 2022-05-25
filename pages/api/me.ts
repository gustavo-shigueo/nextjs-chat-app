import UserController from 'controllers/User'
import refreshCredentials from 'middlewares/authentication/refreshCredentials'
import errorSerializer from 'middlewares/serializers/errorSerializer'
import { NextApiRequest, NextApiResponse } from 'next'
import userSerializer from 'middlewares/serializers/userSerializer'

const me = async (req: NextApiRequest, res: NextApiResponse) => {
	try {
		await refreshCredentials(req, res)
		const user = await UserController.findById(req.body.user.id)

		res.json(userSerializer(user))
	} catch (error: any) {
		errorSerializer(res, error)
	}
}

export default me
