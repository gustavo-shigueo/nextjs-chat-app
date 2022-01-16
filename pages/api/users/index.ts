import { NextApiRequest, NextApiResponse } from 'next'
import UserController from 'controllers/User'
import userSerializer from 'middlewares/serializers/userSerializer'

const listUsers = async (_req: NextApiRequest, res: NextApiResponse) => {
	const users = await UserController.listAll()
	const publicData = users.map(userSerializer)

	res.json(publicData)
}

export default listUsers
