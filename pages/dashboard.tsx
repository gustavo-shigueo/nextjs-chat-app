import MainPanel from '_components/MainPanel'
import authGuard from 'guards/autth/authGuard'
import IChat from 'interfaces/IChat'
import { GetServerSideProps } from 'next'
import { FC } from 'react'
import api from 'services/axios'

interface IDashboardPageProps {
	chats: IChat[]
}

const Dashboard: FC<IDashboardPageProps> = ({ chats }) => {
	return <MainPanel chats={chats} />
}

export const getServerSideProps: GetServerSideProps = async ctx => {
	try {
		const authenticatedUserData = await authGuard(ctx)

		const { data: chats } = await api.post<IChat[]>(
			'/chats',
			{},
			{
				withCredentials: true,
				headers: { Cookie: ctx.req.headers.cookie ?? '' },
			}
		)

		return {
			props: {
				authenticatedUserData,
				chats,
			},
		}
	} catch (error: any) {
		return {
			props: {
				authenticatedUserData: {
					serverSideAccessToken: null,
					serverSideUser: null,
					serverSideError: error,
				},
			},
			redirect: {
				destination: `/${ctx.locale}`,
				permanent: false,
			},
		}
	}
}

export default Dashboard
