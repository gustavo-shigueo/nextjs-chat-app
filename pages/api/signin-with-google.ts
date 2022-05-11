import AuthController from 'controllers/Auth'
import errorSerializer from 'middlewares/serializers/errorSerializer'
import giveCredentials from 'middlewares/authentication/giveCredentials'
import publicUserSerializer from 'middlewares/serializers/publicUserSerializer'
import { NextApiRequest, NextApiResponse } from 'next'
import allowMethods from 'middlewares/allowMethods'
import dbConnect from 'utils/dbConnect'

const signinWithGoogle = async (req: NextApiRequest, res: NextApiResponse) => {
	try {
		allowMethods(req, 'POST')
		await dbConnect()

		const { body } = req
		const {
			googleAccessToken,
			googleProfile: { googleId, name, email, imageUrl },
		} = body

		const user = await AuthController.signInWithGoogle(googleAccessToken, {
			googleId,
			name,
			email,
			imageUrl,
		})

		await giveCredentials(req, res, user._id)

		return res.json({ user: publicUserSerializer(user) })
	} catch (error: any) {
		errorSerializer(res, error)
	}
}

export default signinWithGoogle
