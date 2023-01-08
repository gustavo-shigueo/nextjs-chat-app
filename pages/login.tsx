import Button from 'components/Button'
import Form from 'components/Form'
import Input from 'components/Input'
import { useAuth } from 'contexts/UserContext'
import { NextPage } from 'next'
import { SubmitHandler, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { string, z } from 'zod'
import GoogleLogin from 'components/GoogleLogin'
import emailRegex from 'utils/emailRegex'
import passwordRegex from 'utils/passwordRegex'

const schema = z.object({
	email: string()
		.min(1, 'Este campo é obrigatório')
		.email('E-mail inválido')
		.regex(
			/([a-z0-9]{2,})(?:\.[a-z0-9]{2,})*@([a-z0-9]{2,})(?:\.[a-z0-9]{2,})+/,
			'E-mail inválido'
		),
	password: string()
		.min(1, 'Este campo é obrigatório')
		.min(8, 'Senha deve ter entre 8 e 32 caracteres')
		.max(32, 'Senha deve ter entre 8 e 32 caracteres')
		.regex(
			passwordRegex,
			'Senha deve conter letras minúsculas, letras maiúsculas, números e caracteres especiais'
		),
})

type FormData = z.infer<typeof schema>

const Login: NextPage = () => {
	const { login, error, loading } = useAuth()
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({
		defaultValues: { email: '', password: '' },
		resolver: zodResolver(schema),
		mode: 'all',
	})

	const onSubmit: SubmitHandler<FormData> = async data => {
		console.log(data)
		login({ profile: data })
	}

	const responseGoogle = async (response: any) => {
		const { access_token: googleAccessToken } = response

		login({ googleAccessToken })
	}

	return (
		<>
			<div className="container">
				<h1 className="font-size-600 margin-block-300 font-weight-bold text-align-center">
					Login
				</h1>
				<Form onSubmit={handleSubmit(data => onSubmit(data), console.error)}>
					<Input<FormData>
						name="email"
						label="E-mail"
						type="email"
						register={register}
						errors={errors}
						autoComplete="username"
						pattern={emailRegex.source}
						required
					/>

					<Input<FormData>
						name="password"
						label="Senha"
						type="password"
						register={register}
						errors={errors}
						autoComplete="current-password"
						pattern={passwordRegex.source}
						required
					/>

					<div className="control" data-control-type="buttons">
						<GoogleLogin onSuccess={responseGoogle} text="signin" />
						<Button variant="success" type="submit" loading={loading}>
							Enviar
						</Button>
					</div>
				</Form>
			</div>
		</>
	)
}

export default Login
