import { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from 'utils/dbConnect'
import AuthController from 'controllers/Auth'
import giveCredentials from 'middlewares/giveCredentials'
import MethodNotAllowedError from 'errors/MethodNotAllowed'
import errorSerializer from 'middlewares/errorSerializer'
import IPublicUserData from 'interfaces/IPublicUserData'
import userSerializer from 'middlewares/userSerializer'

const signin = async (req: NextApiRequest, res: NextApiResponse) => {
	await dbConnect()

	const { method, body } = req

	if (method !== 'POST') throw new MethodNotAllowedError(method)

	try {
		const { email, password } = body
		const user = await AuthController.signInWithEmailAndPassword(
			email,
			password
		)

		try {
			await giveCredentials(req, res, user._id)
		} catch (e) {
			console.log(e)
		}

		res.json({ user: userSerializer(user) })
	} catch (error: any) {
		errorSerializer(res, error)
	}
}

export default signin
