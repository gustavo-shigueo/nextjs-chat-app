import { NextApiRequest, NextApiResponse } from 'next'
import UserController from 'controllers/User'
import errorSerializer from 'middlewares/serializers/errorSerializer'
import allowMethods from 'middlewares/allowMethods'
import publicUserSerializer from 'middlewares/serializers/publicUserSerializer'

const getUsers = async (req: NextApiRequest, res: NextApiResponse) => {
	try {
		allowMethods(req, 'GET')

		const { name } = req.query
		const user = await UserController.findByName(name as string)

		res.json(user.map(publicUserSerializer))
	} catch (error: any) {
		errorSerializer(res, error)
	}
}

export default getUsers
