import { api } from '../../../utils/api'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Spinner from '../../../components/Spinner'
import { IoMail } from 'react-icons/io5'

export default function ConfirmationMessage() {
	const requestConfirmation = api.users.requestConfirmationEmail.useMutation()
	const [timer, setTimer] = useState(30)
	const {
		query: { userId },
		isReady,
		push,
	} = useRouter()

	useEffect(() => {
		const interval = setInterval(() => {
			setTimer(t => Math.max(t - 1, 0))
		}, 1_000)

		return () => clearInterval(interval)
	}, [])

	const { data, error, isLoading } = api.users.get.useQuery(
		{
			id: (userId ?? '') as string,
		},
		{
			onError(err) {
				console.log(err)
			},
		}
	)

	if (isReady && !userId) {
		void push('/')
		return null
	}

	if (isLoading) {
		return (
			<main className="grid place-items-center">
				<Spinner size={5} />
			</main>
		)
	}

	if (error) {
		return <main>Algo deu errado!</main>
	}

	return (
		<main className="grid place-items-center gap-2">
			<section>
				<h2 className="text-center text-2xl font-bold">
					Seu cadastro foi realizado com sucesso!
				</h2>

				<span>
					<IoMail className="mli-auto" size={150} />
				</span>

				<p>Confirme seu email para fazer login</p>

				<p className="text-neutral-700 dark:text-neutral-300">
					Não recebeu o e-mail de confirmação?{' '}
					{timer > 0 ? (
						<span className="text-neutral-600 dark:text-neutral-400">
							Por favor aguarde {timer} segundos
						</span>
					) : (
						<button
							className="m-0 cursor-pointer appearance-none border-none bg-transparent p-0 font-bold text-neutral-800 underline dark:text-neutral-200"
							onClick={() => {
								requestConfirmation.mutate({ email: data.email })
								setTimer(30)
							}}
						>
							Clique aqui
						</button>
					)}
				</p>
			</section>
		</main>
	)
}
