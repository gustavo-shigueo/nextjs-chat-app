import { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from 'utils/dbConnect'
import AuthController from 'controllers/Auth'
import giveCredentials from 'middlewares/authentication/giveCredentials'
import errorSerializer from 'middlewares/serializers/errorSerializer'
import userSerializer from 'middlewares/serializers/userSerializer'
import allowMethods from 'middlewares/allowMethods'

const signup = async (req: NextApiRequest, res: NextApiResponse) => {
	await dbConnect()
	allowMethods(req, 'POST')

	try {
		const { body } = req
		const { name, email, password } = body

		const user = await AuthController.signup({
			name,
			email,
			password,
		})

		giveCredentials(req, res, user._id)

		res.statusCode = 201
		res.json({ user: userSerializer(user) })
	} catch (error: any) {
		errorSerializer(res, error)
	}
}

export default signup
