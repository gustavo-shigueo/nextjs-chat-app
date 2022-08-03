import MainPanel from 'components/MainPanel'
import authGuard from 'guards/autth/authGuard'
import IContact from 'interfaces/IContact'
import { GetServerSideProps } from 'next'
import { FC } from 'react'
import api from 'services/axios'

interface IDashboardPageProps {
	contacts: IContact[]
}

const Dashboard: FC<IDashboardPageProps> = ({ contacts }) => {
	return <MainPanel contacts={contacts} />
}

export const getServerSideProps: GetServerSideProps = async ctx => {
	try {
		const authenticatedUserData = await authGuard(ctx)

		return {
			props: {
				authenticatedUserData,
				contacts: [],
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
				destination: '/login',
				permanent: false,
			},
		}
	}
}

export default Dashboard
