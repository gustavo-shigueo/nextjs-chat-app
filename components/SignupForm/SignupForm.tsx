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

const schema = z
	.object({
		name: string().min(2),
		email: string().email().regex(emailRegex),
		password: string().min(8).max(32).regex(passwordRegex),
		confirmPassword: string().min(8).max(32).regex(passwordRegex),
	})
	.superRefine(({ confirmPassword, password }, ctx) => {
		if (confirmPassword === password) return

		ctx.addIssue({ code: 'custom', message: 'As senhas devem ser iguais' })
	})

type FormData = z.infer<typeof schema>

interface SignupFormProps extends HTMLAttributes<HTMLDivElement> {
	inert: boolean
	setForm: Dispatch<SetStateAction<'login' | 'signup' | undefined>>
}

const SignupForm = forwardRef<HTMLDivElement, SignupFormProps>(
	({ inert, setForm, ...props }, ref) => {
		const { loading, signup } = useAuth()
		const {
			register,
			handleSubmit,
			formState: { errors },
		} = useForm({
			defaultValues: { name: '', email: '', password: '', confirmPassword: '' },
			resolver: zodResolver(schema),
			mode: 'all',
		})

		const responseGoogle = async (response: any) => {
			const { access_token: accessToken } = response

			signup({ googleAccessToken: accessToken })
		}

		const onSubmit: SubmitHandler<FormData> = async data => {
			await signup({ profile: data })
		}

		return (
			<div
				// @ts-ignore
				// eslint-disable-next-line react/no-unknown-property
				inert={inert ? 'true' : undefined}
				ref={ref}
				{...props}
			>
				<h3 className="font-size-600 margin-block-300 font-weight-bold text-align-center">
					Cadastre-se
				</h3>
				<Form onSubmit={handleSubmit(data => onSubmit(data), console.error)}>
					<Input<FormData>
						name="name"
						label="Nome"
						type="text"
						register={register}
						errors={errors}
						autoComplete="name"
						minLength={2}
						required
					/>

					<Input<FormData>
						name="email"
						label="E-mail"
						type="email"
						register={register}
						errors={errors}
						autoComplete="username"
						pattern={emailRegex.source}
						title="Digite um e-mail válido"
						required
					/>

					<Input<FormData>
						name="password"
						label="Senha"
						type="password"
						register={register}
						errors={errors}
						autoComplete="new-password"
						title="Senhas devem conter entre 8 e 32 caracaters, incluindo letras minúsculas, maiúsculas, números e símbolos"
						pattern={passwordRegex.source}
						required
					/>

					<Input<FormData>
						name="confirmPassword"
						label="Confirme sua senha"
						type="password"
						register={register}
						errors={errors}
						autoComplete="new-password"
						pattern={passwordRegex.source}
						title="Senhas devem conter entre 8 e 32 caracaters, incluindo letras minúsculas, maiúsculas, números e símbolos"
						required
					/>

					<div className="control">
						<p>
							Já tem uma conta?{' '}
							<span
								onClick={() => setForm('login')}
								className="font-weight-bold underline"
								style={{ cursor: 'pointer' }}
							>
								Entre
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
		)
	}
)

SignupForm.displayName = 'SignupForm'

export default SignupForm
