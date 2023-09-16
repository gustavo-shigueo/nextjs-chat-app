import { api } from '../../../utils/api'
import Button from '../../../components/Button'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Spinner from '../../../components/Spinner'

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
			<main>
				<Spinner />
			</main>
		)
	}

	if (error) {
		return <main>Algo deu errado!</main>
	}

	return (
		<main>
			<h2>Seu cadastro foi realizado com sucesso!</h2>
			<p>Confirme seu email para fazer login</p>

			<p>
				Não recebeu o e-mail de confirmação?{' '}
				<Button
					variant="primary"
					disabled={timer > 0}
					onClick={() => {
						requestConfirmation.mutate({ email: data.email })
						setTimer(30)
					}}
				>
					Clique aqui{timer > 0 && ` em ${timer} segundos`}
				</Button>
			</p>
		</main>
	)
}
