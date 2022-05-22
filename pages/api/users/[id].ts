import { NextApiRequest, NextApiResponse } from 'next'
import UserController from 'controllers/User'
import errorSerializer from 'middlewares/serializers/errorSerializer'
import publicUserSerializer from 'middlewares/serializers/publicUserSerializer'
import allowMethods from 'middlewares/allowMethods'

const getUser = async (req: NextApiRequest, res: NextApiResponse) => {
	try {
		allowMethods(req, 'GET')

		const { id } = req.query
		const user = await UserController.findById(id as string)

		res.json(publicUserSerializer(user))
	} catch (error: any) {
		errorSerializer(res, error)
	}
}

export default getUser
