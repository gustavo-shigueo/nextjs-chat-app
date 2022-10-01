import errorSerializer from 'middlewares/serializers/errorSerializer'
import { NextApiRequest, NextApiResponse } from 'next'
import revokeCredentials from 'middlewares/authentication/revokeCredentials'
import verifyCredentials from 'middlewares/authentication/verifyCredentials'
import ChatController from 'controllers/Chats'
import allowMethods from 'middlewares/allowMethods'

const chats = async (req: NextApiRequest, res: NextApiResponse) => {
	try {
		allowMethods(req, 'POST')
		await verifyCredentials(req)
		const chats = await ChatController.findByUser(req.body.user.id)

		res.json(chats)
	} catch (error: any) {
		await revokeCredentials(req, res)
		errorSerializer(res, error)
	}
}

export default chats
