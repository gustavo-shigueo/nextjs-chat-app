import { NextApiRequest, NextApiResponse } from 'next'
import errorSerializer from 'middlewares/serializers/errorSerializer'
import allowMethods from 'middlewares/allowMethods'
import MessageController from 'controllers/Message'
import verifyCredentials from 'middlewares/authentication/verifyCredentials'

const getUser = async (req: NextApiRequest, res: NextApiResponse) => {
	try {
		allowMethods(req, 'GET')
		verifyCredentials(req)

		const { chatId, cursor } = req.query
		const latestMessage = new Date(Number.parseInt(cursor as string))

		const messages = await MessageController.findByChatId(
			req.body.user.id,
			chatId as string,
			latestMessage
		)

		res.json(messages)
	} catch (error: any) {
		errorSerializer(res, error)
	}
}

export default getUser
