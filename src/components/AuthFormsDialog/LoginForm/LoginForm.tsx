import { zodResolver } from '@hookform/resolvers/zod'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/router'
import {
	forwardRef,
	useEffect,
	useRef,
	useState,
	type Dispatch,
	type HTMLAttributes,
	type SetStateAction,
} from 'react'
import { useForm } from 'react-hook-form'
import { IoEye, IoEyeOff } from 'react-icons/io5'
import { z } from 'zod'
import Button from '../../../components/Button'
import Form from '../../../components/Form'
import GoogleLoginButton from '../../../components/GoogleLoginButton'
import Input from '../../../components/Input'
import passwordRegex from '../../../utils/regex/password'
import Link from 'next/link'
import emailRegex from '../../../utils/regex/email'

interface LoginFormProps extends Omit<HTMLAttributes<HTMLDivElement>, 'inert'> {
	setForm: Dispatch<SetStateAction<'login' | 'signup' | undefined>>
	transitionDuration: number
	inert?: boolean
}

const schema = z.object({
	email: z.string().min(1, 'Este campo é obrigatório').email('E-mail inválido'),
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

type FormData = z.infer<typeof schema>

const LoginForm = forwardRef<HTMLDivElement, LoginFormProps>(
	({ setForm, inert, transitionDuration, ...props }, ref) => {
		const overflowRef = useRef<HTMLDivElement>(null)
		const [error, setError] = useState('')
		const { locale, defaultLocale = 'pt-br' } = useRouter()

		const {
			register,
			handleSubmit,
			formState: { errors },
		} = useForm({
			defaultValues: { email: '', password: '' },
			resolver: zodResolver(schema),
			mode: 'all',
		})

		const [type, setType] = useState<'password' | 'text'>('password')

		const onSubmit = async (data: FormData) => {
			const response = await signIn('credentials', {
				redirect: false,
				callbackUrl: `/${locale ?? defaultLocale}/dashboard`,
				...data,
			})

			setError('')

			if (!response) return

			if (response.ok) {
				setForm(undefined)
				location.pathname = `/${locale ?? defaultLocale}/dashboard`
				return
			}

			setForm('login')
			setError(response.error ?? '')
		}

		useEffect(() => {
			if (!overflowRef.current) return

			const target = overflowRef.current

			if (inert) {
				target.style.overflow = 'hidden'
				return
			}

			const timeout = setTimeout(() => {
				target.style.overflow = 'visible'
			}, transitionDuration)

			return () => clearTimeout(timeout)
		}, [inert, transitionDuration])

		return (
			<div
				style={{
					gridTemplateRows: inert ? '0fr' : '1fr',
					opacity: inert ? 0 : 1,
					translate: inert ? '-100%' : '0',
					transitionDuration: `${transitionDuration}ms`,
				}}
				ref={ref}
				inert={inert ? 'true' : undefined}
				{...props}
			>
				<div ref={overflowRef}>
					<h2 className="text-center text-3xl font-bold em:mlb-3">Login</h2>

					{error && (
						<div className="text-md text-center text-lg font-bold text-red-600 mbe-2 dark:text-red-500">
							<Error error={error} />
						</div>
					)}

					<Form
						className="em:gap-3"
						onSubmit={e => {
							e.preventDefault()
							void handleSubmit(onSubmit)(e)
						}}
					>
						<Input
							label="E-mail"
							autoComplete="username"
							type="email"
							required
							disabled={inert}
							error={errors.email?.message}
							pattern={emailRegex.source}
							{...register('email')}
						/>
						<Input
							label="Senha"
							type={type}
							disabled={inert}
							required
							autoComplete="current-password"
							error={errors.password?.message}
							pattern={passwordRegex.source}
							rightIcon={
								<Button
									variant="flat"
									outline
									disabled={inert}
									onClick={() => {
										setType(t => (t === 'password' ? 'text' : 'password'))
									}}
								>
									{type === 'password' ? <IoEye /> : <IoEyeOff />}
								</Button>
							}
							{...register('password')}
						/>

						<div className="grid text-sm em:gap-1">
							<p>
								Não tem uma conta?&nbsp;
								<button
									disabled={inert}
									type="button"
									onClick={() => setForm('signup')}
									className="m-0 cursor-pointer appearance-none border-none bg-transparent p-0 font-bold underline"
								>
									Cadastre-se
								</button>
							</p>

							<p className="font-bold underline">
								<Link
									onClick={() => setForm(undefined)}
									href={`/${locale ?? defaultLocale}/reset-password`}
								>
									Esqueceu sua senha?
								</Link>
							</p>
						</div>
						<div className="grid auto-cols-fr grid-flow-row auto-rows-fr justify-end em:gap-3">
							<Button disabled={inert} type="submit" variant="success">
								Enviar
							</Button>
							<GoogleLoginButton disabled={inert} text="signin" />
						</div>
					</Form>
				</div>
			</div>
		)
	}
)

LoginForm.displayName = 'LoginForm'

function Error({ error }: { error: string }) {
	switch (error) {
		case 'CredentialsNotProvided':
			return <p>Por favor forneça suas credenciais</p>
		case 'InvalidCredentials':
			return <p>Credenciais inválidas</p>
		case 'InvalidSigninMethod':
			return (
				<p>
					Modo de login inválido! Por favor use sua conta Google para entrar
				</p>
			)
		case 'EmailNotVerified':
			return <p>Seu e-mail não foi verificado! Verifique seu e-mail</p>
		default:
			return <p>Erro desconhecido</p>
	}
}

export default LoginForm
