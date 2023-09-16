import { useRouter } from 'next/router'
import { api } from '../../../utils/api'
import { useEffect, useState } from 'react'
import Spinner from '../../../components/Spinner'
import Link from 'next/link'

export default function ConfirmEmail() {
	const [status, setStatus] = useState<
		'idle' | 'loading' | 'success' | 'error'
	>('idle')
	const {
		query: { userId, token },
		isReady,
		locale,
		defaultLocale = 'pt-br',
	} = useRouter()
	const confirmEmail = api.users.confirmEmail.useMutation()

	useEffect(() => {
		if (!isReady || status !== 'idle') return

		async function confirm() {
			setStatus('loading')
			await confirmEmail
				.mutateAsync({ id: userId as string, token: token as string })
				.then(() => setStatus('success'))
				.catch(() => setStatus('error'))
		}

		void confirm()
	}, [isReady, confirmEmail, userId, token, status])

	switch (status) {
		case 'loading':
			return (
				<main>
					<Spinner />
				</main>
			)

		case 'error':
			return (
				<main>
					Algo deu errado! Clique{' '}
					<Link
						href={`/${locale ?? defaultLocale}/confirmEmail/${
							userId as string
						}`}
					>
						aqui
					</Link>{' '}
					para solicitar o reenvio do e-mail de confirmação
				</main>
			)

		case 'success':
			return <main>Success! You can login now!</main>
	}
}
