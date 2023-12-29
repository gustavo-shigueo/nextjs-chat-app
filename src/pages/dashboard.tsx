import { type GetServerSidePropsContext, type NextPage } from 'next'
import { useSession } from 'next-auth/react'
import MainPanel from '../components/MainPanel/MainPanel'
import Spinner from '../components/Spinner/Spinner'
import { CallProvider } from '../contexts/CallContext'
import { ChatProvider } from '../contexts/ChatContext'
import { getServerAuthSession } from '../server/auth'
import { api } from '../utils/api'
import Head from 'next/head'

const DashBoard: NextPage = () => {
	const { data: chats, isLoading } = api.chats.list.useQuery()
	const { data: session } = useSession()

	if (isLoading || !chats || !session)
		return (
			<>
				<Head>
					<title>MimisChat</title>
				</Head>
				<section className="grid place-items-center">
					<Spinner size={5} />
				</section>
			</>
		)

	return (
		<>
			<Head>
				<title>MimisChat</title>
			</Head>
			<ChatProvider chats={chats} userId={session.user.id}>
				<CallProvider>
					<MainPanel />
				</CallProvider>
			</ChatProvider>
		</>
	)
}

export default DashBoard

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
	if (!ctx.locale) {
		return {
			redirect: { destination: '/pt-br/dashboard', permanent: false },
		}
	}

	const session = await getServerAuthSession(ctx)

	if (!session) {
		return {
			redirect: {
				destination: `/${ctx.locale}`,
				permanent: false,
			},
		}
	}

	return { props: { session } }
}
