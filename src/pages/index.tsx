import { type GetServerSideProps } from 'next'
import { Tab, TabList, TabPanel, Tabs } from '../components/Tabs'
import { getServerAuthSession } from '../server/auth'
import Head from 'next/head'

export default function Home() {
	return (
		<>
			<Head>
				<title>WeChat</title>
			</Head>
			<main>
				Página Inicial
				<Tabs direction="vertical">
					<TabList>
						<Tab active index={1}>
							Teste 1
						</Tab>

						<Tab index={2}>Teste 2</Tab>

						<Tab index={3}>Teste 3</Tab>
					</TabList>

					<TabPanel index={1}>teste 1</TabPanel>

					<TabPanel index={2}>teste 2</TabPanel>

					<TabPanel index={3}>teste 3</TabPanel>
				</Tabs>
			</main>
		</>
	)
}

export const getServerSideProps: GetServerSideProps = async ctx => {
	if (!ctx.locale) {
		return {
			redirect: { destination: '/pt-br/', permanent: false },
		}
	}

	const session = await getServerAuthSession(ctx)

	if (!session) return { props: { session: null } }

	return {
		redirect: {
			destination: `/${ctx.locale ?? 'pt-br'}/dashboard`,
			permanent: false,
		},
	}
}
