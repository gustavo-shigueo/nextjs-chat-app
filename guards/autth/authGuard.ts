import { IUserProviderProps } from 'contexts/UserContext'
import IUser from 'interfaces/IUser'
import { GetServerSidePropsContext, PreviewData } from 'next'
import { ParsedUrlQuery } from 'querystring'
import api, { ApiError } from 'services/axios'

type AuthGuard = (
	ctx: GetServerSidePropsContext<ParsedUrlQuery, PreviewData>
) => Promise<IUserProviderProps>

const authGuard: AuthGuard = async ({ req, res }) => {
	try {
		const { data, headers } = await api.post<IUser>('/me', {}, {
			withCredentials: true,
			headers: { Cookie: req.headers.cookie },
		} as any)

		res.setHeader('set-cookie', Object.freeze(headers['set-cookie'] ?? []))

		return {
			serverSideUser: data,
			serverSideAccessToken: headers.authorization,
			serverSideError: null,
		}
	} catch (e: any) {
		const error = (e as ApiError).response?.data ?? null
		throw error
	}
}

export default authGuard
