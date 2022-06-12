import UserController from 'controllers/User'
import allowMethods from 'middlewares/allowMethods'
import verifyCredentials from 'middlewares/authentication/verifyCredentials'
import errorSerializer from 'middlewares/serializers/errorSerializer'
import { NextApiRequest, NextApiResponse } from 'next'

const contacts = async (req: NextApiRequest, res: NextApiResponse) => {
	try {
		allowMethods(req, 'GET')
		await verifyCredentials(req)

		const contacts = await UserController.listUserContacts(req.body.user.id)

		res.json(contacts)
	} catch (error: any) {
		errorSerializer(res, error)
	}
}

export default contacts
