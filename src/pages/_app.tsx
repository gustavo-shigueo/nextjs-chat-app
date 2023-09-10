import { type Session } from 'next-auth'
import { SessionProvider } from 'next-auth/react'
import { type AppType } from 'next/app'
import { useRouter } from 'next/router'

import { api } from '../utils/api'

import { useEffect } from 'react'
import Header from '../components/Header'
import '../styles/globals.css'

const MyApp: AppType<{ session: Session | null }> = ({
	Component,
	pageProps: { session, ...pageProps },
}) => {
	const { locale = 'pt-br' } = useRouter()

	useEffect(() => {
		document.body.parentElement?.setAttribute('lang', locale)
	}, [locale])

	return (
		<>
			<SessionProvider session={session}>
				<Header />
				<Component {...pageProps} />
			</SessionProvider>
		</>
	)
}

export default api.withTRPC(MyApp)
