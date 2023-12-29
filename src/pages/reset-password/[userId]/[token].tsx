import { api } from 'src/utils/api'
import Button from '../../../components/Button'
import Form from '../../../components/Form'
import Input from '../../../components/Input'
import { useState } from 'react'
import { useRouter } from 'next/router'
import passwordRegex from '../../../utils/regex/password'
import { IoEye, IoEyeOff } from 'react-icons/io5'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

const schema = z.object({
	password: z
		.string()
		.min(1, 'Este campo é obrigatório')
		.min(8, 'Senha deve ter entre 8 e 32 caracteres')
		.max(32, 'Senha deve ter entre 8 e 32 caracteres')
		.regex(
			passwordRegex,
			'Senha deve conter letras minúsculas, letras maiúsculas, números e caracteres especiais'
		),
})

export default function RequestResetPassword() {
	const resetPassword = api.users.resetPassword.useMutation()

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({
		defaultValues: { password: '' },
		resolver: zodResolver(schema),
		mode: 'all',
	})

	const [type, setType] = useState<'password' | 'text'>('password')

	const router = useRouter()

	async function onSubmit({ password }: { password: string }) {
		await resetPassword
			.mutateAsync({
				id: router.query.userId as string,
				token: router.query.token as string,
				password,
			})
			.then(() => router.push(`/`))
			.catch()
	}

	return (
		<main className="grid place-items-center">
			<Form
				className="is-[min(65ch,_90dvi)]"
				onSubmit={e => {
					e.preventDefault()
					void handleSubmit(onSubmit, () => undefined)(e)
				}}
			>
				<h2 className="text-center text-xl font-bold">Redefinição de senha:</h2>

				<Input
					label="Senha"
					type={type}
					autoComplete="new-password"
					pattern={passwordRegex.source}
					required
					error={errors.password?.message}
					rightIcon={
						<Button
							variant="flat"
							outline
							onClick={() => {
								setType(t => (t === 'password' ? 'text' : 'password'))
							}}
						>
							{type === 'password' ? <IoEye /> : <IoEyeOff />}
						</Button>
					}
					{...register('password')}
				/>

				<div>
					<Button type="submit" className="block mis-auto">
						Enviar
					</Button>
				</div>
			</Form>
		</main>
	)
}
