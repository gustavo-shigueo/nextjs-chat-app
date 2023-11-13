import { useRouter } from 'next/router'
import { api } from '../../../utils/api'
import { useEffect, useState } from 'react'
import Spinner from '../../../components/Spinner'
import Link from 'next/link'
import {
	IoMdCloseCircleOutline,
	IoMdCheckmarkCircleOutline,
} from 'react-icons/io'

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
				<main className="grid place-items-center gap-2">
					<Spinner />
				</main>
			)

		case 'error':
			return (
				<main className="grid place-items-center gap-2">
					<section>
						<h2 className="text-center text-2xl font-bold">Algo deu errado!</h2>

						<span>
							<IoMdCloseCircleOutline
								className="text-red-500 mli-auto"
								size={150}
							/>
						</span>

						<p className="text-neutral-700 dark:text-neutral-300">
							Clique{' '}
							<Link
								className="m-0 cursor-pointer appearance-none border-none bg-transparent p-0 font-bold text-neutral-800 underline dark:text-neutral-200"
								href={`/${locale ?? defaultLocale}/confirmEmail/${
									userId as string
								}`}
							>
								aqui
							</Link>{' '}
							para solicitar o reenvio do e-mail de confirmação
						</p>
					</section>
				</main>
			)

		case 'success':
			return (
				<main className="grid place-items-center gap-2">
					<section>
						<h2 className="text-center text-2xl font-bold">
							E-mail confirmado com sucesso!
						</h2>

						<span>
							<IoMdCheckmarkCircleOutline
								className="text-green-500 mli-auto"
								size={150}
							/>
						</span>
					</section>
				</main>
			)
	}
}
