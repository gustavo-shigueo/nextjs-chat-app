// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import allowMethods from 'middlewares/allowMethods'
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
		allowMethods(_req, 'GET', 'POST', 'PATCH')
		_res.status(200).json({ name: 'John Doe' })
	} catch (e: any) {
		errorSerializer(_res, e)
	}
}
