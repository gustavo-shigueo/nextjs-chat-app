import { NextApiRequest, NextApiResponse } from 'next'
import UserController from 'controllers/User'
import publicUserSerializer from 'middlewares/serializers/publicUserSerializer'
import allowMethods from 'middlewares/allowMethods'
import dbConnect from 'utils/dbConnect'
import errorSerializer from 'middlewares/serializers/errorSerializer'

const listUsers = async (req: NextApiRequest, res: NextApiResponse) => {
	try {
		allowMethods(req, 'GET')
		await dbConnect()

		const users = await UserController.listAll()
		const publicData = users.map(publicUserSerializer)

		res.json(publicData)
	} catch (error: any) {
		errorSerializer(res, error)
	}
}

export default listUsers
