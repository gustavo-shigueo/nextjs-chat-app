import { api } from '../../utils/api'
import Button from '../../components/Button'
import Form from '../../components/Form'
import Input from '../../components/Input'
import { useEffect, useState } from 'react'

export default function RequestResetPassword() {
	const requestReset = api.users.requestPasswordReset.useMutation()
	const [email, setEmail] = useState('')
	const [timer, setTimer] = useState(0)

	useEffect(() => {
		const interval = setInterval(() => {
			setTimer(t => Math.max(t - 1, 0))
		}, 1_000)

		return () => clearInterval(interval)
	}, [])

	return (
		<main className="grid place-items-center">
			<Form
				className="is-[min(65ch,_90dvi)]"
				onSubmit={e => {
					e.preventDefault()
					void requestReset.mutateAsync({ email }).catch()
					setTimer(30)
				}}
			>
				<h2 className="text-center text-xl font-bold">Redefinição de senha:</h2>
				<Input
					label="E-mail"
					autoComplete="username"
					type="email"
					name="email"
					required
					value={email}
					onChange={e => setEmail(e.currentTarget.value)}
					pattern="^[a-zA-Z0-9.!#$%&'*+\/=?^_`\{\|\}~\-]+@[a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?)*$"
				/>

				<p>
					Digite seu e-mail e clique em Enviar. Se o e-mail digitado estiver
					cadastrado, lhe enviaremos um link para redefinir sua senha
				</p>

				<div>
					<Button type="submit" disabled={timer > 0} className="block mis-auto">
						{timer === 0 ? 'Enviar' : `Tente novamente em ${timer} segundos`}
					</Button>
				</div>
			</Form>
		</main>
	)
}
