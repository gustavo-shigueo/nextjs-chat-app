import { NextApiRequest, NextApiResponse } from 'next'
import UserController from 'controllers/User'
import errorSerializer from 'middlewares/serializers/errorSerializer'
import userSerializer from 'middlewares/serializers/userSerializer'
import allowMethods from 'middlewares/allowMethods'
import verifyCredentials from 'middlewares/authentication/verifyCredentials'

const getUser = async (req: NextApiRequest, res: NextApiResponse) => {
	try {
		await verifyCredentials(req)
		allowMethods(req, 'POST')

		const { contactId } = req.query
		const user = await UserController.addToUserContacts(
			req.body.user.id,
			contactId as string
		)

		res.json(userSerializer(user))
	} catch (error: any) {
		errorSerializer(res, error)
	}
}

export default getUser
