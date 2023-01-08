import { zodResolver } from '@hookform/resolvers/zod'
import Button from 'components/Button'
import Form from 'components/Form'
import GoogleLogin from 'components/GoogleLogin'
import Input from 'components/Input'
import { useAuth } from 'contexts/UserContext'
import { Dispatch, forwardRef, HTMLAttributes, SetStateAction } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import emailRegex from 'utils/emailRegex'
import passwordRegex from 'utils/passwordRegex'
import { string, z } from 'zod'

interface LoginFormProps extends HTMLAttributes<HTMLDivElement> {
	inert: boolean
	setForm: Dispatch<SetStateAction<'login' | 'signup' | undefined>>
}

const schema = z.object({
	email: string()
		.min(1, 'Este campo é obrigatório')
		.email('E-mail inválido')
		.regex(emailRegex, 'E-mail inválido'),
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

const LoginForm = forwardRef<HTMLDivElement, LoginFormProps>(
	({ setForm, inert, ...props }, ref) => {
		const { login, loading, error } = useAuth()
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
			await login({ profile: data })
		}

		const responseGoogle = async (response: any) => {
			const { access_token: googleAccessToken } = response

			login({ googleAccessToken })
		}

		return (
			<>
				<div
					// @ts-ignore
					// eslint-disable-next-line react/no-unknown-property
					inert={inert ? 'true' : undefined}
					ref={ref}
					{...props}
				>
					<h3 className="font-size-600 margin-block-300 font-weight-bold text-align-center">
						Login
					</h3>
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

						<div className="control">
							<p>
								Não tem uma conta?{' '}
								<span
									onClick={() => setForm('signup')}
									className="font-weight-bold underline"
									style={{ cursor: 'pointer' }}
								>
									Cadastre-se
								</span>
							</p>
						</div>

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
)

LoginForm.displayName = 'LoginForm'

export default LoginForm
