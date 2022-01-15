// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import errorSerializer from 'middlewares/serializers/errorSerializer'
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
	name: string
}

export default async function handler(
	_req: NextApiRequest,
	_res: NextApiResponse<Data>
) {
	try {
		_res.status(200).json({ name: 'John Doe' })
	} catch (e: any) {
		errorSerializer(_res, e)
	}
}
