import 'styles/globals.scss'
import type { AppProps } from 'next/app'
import { IUserProviderProps, UserProvider } from 'contexts/UserContext'
import { GoogleOAuthProvider } from '@react-oauth/google'
import Header from 'components/Header'
import Head from 'next/head'

function MyApp({
	Component,
	pageProps,
}: AppProps<{ authenticatedUserData: IUserProviderProps }>) {
	return (
		<>
			<Head>
				<title>MiChat</title>
			</Head>

			<GoogleOAuthProvider
				clientId={process.env.NEXT_PUBLIC_GOOGLE_OAUTH_CLIENT_ID ?? ''}
			>
				<UserProvider {...pageProps.authenticatedUserData}>
					<Header />
					<Component {...pageProps} />
				</UserProvider>
			</GoogleOAuthProvider>
		</>
	)
}

export default MyApp
