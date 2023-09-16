import { zodResolver } from '@hookform/resolvers/zod'
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
import { api } from 'src/utils/api'
import { useRouter } from 'next/router'

interface LoginFormProps extends Omit<HTMLAttributes<HTMLDivElement>, 'inert'> {
	setForm: Dispatch<SetStateAction<'login' | 'signup' | undefined>>
	inert?: boolean
	transitionDuration: number
}

const schema = z
	.object({
		name: z.string().min(1, 'Nome deve conter no mímimo 2 caracteres'),
		email: z
			.string()
			.min(1, 'Este campo é obrigatório')
			.email('E-mail inválido'),
		password: z
			.string()
			.min(1, 'Este campo é obrigatório')
			.min(8, 'Senha deve ter entre 8 e 32 caracteres')
			.max(32, 'Senha deve ter entre 8 e 32 caracteres')
			.regex(
				passwordRegex,
				'Senha deve conter letras minúsculas, letras maiúsculas, números e caracteres especiais'
			),
		confirmPassword: z.string().min(8),
	})
	.superRefine(({ confirmPassword, password }, ctx) => {
		if (confirmPassword === password) return

		ctx.addIssue({ code: 'custom', message: 'As senhas devem ser iguais' })
	})

type FormData = z.infer<typeof schema>

const SignupForm = forwardRef<HTMLDivElement, LoginFormProps>(
	({ setForm, inert, transitionDuration, ...props }, ref) => {
		const overflowRef = useRef<HTMLDivElement>(null)
		const signup = api.users.signup.useMutation()
		const [error, setError] = useState('')
		const { locale, defaultLocale = 'pt-br' } = useRouter()

		const {
			register,
			handleSubmit,
			formState: { errors },
		} = useForm({
			defaultValues: { name: '', email: '', password: '', confirmPassword: '' },
			resolver: zodResolver(schema),
			mode: 'all',
		})

		const [type, setType] = useState<'password' | 'text'>('password')
		const [typeConfirm, setTypeConfirm] = useState<'password' | 'text'>(
			'password'
		)

		const onSubmit = async (data: FormData) => {
			try {
				const { name, email, password } = data

				setError('')

				const id = await signup.mutateAsync({ name, email, password })
				location.pathname = `/${locale ?? defaultLocale}/confirm-email/${id}`
			} catch (e) {
				switch ((e as Error).message) {
					case 'User already exists':
						setError('E-mail já cadastrado')
						break

					default:
						setError('Erro desconhecido')
						break
				}
			}
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
					translate: inert ? '0' : '-100%',
					transitionDuration: `${transitionDuration}ms`,
				}}
				ref={ref}
				inert={inert ? 'true' : undefined}
				{...props}
			>
				<div ref={overflowRef}>
					<h2 className="text-center text-3xl font-bold em:mlb-3">
						Cadastre-se
					</h2>

					{error && (
						<p className="text-md text-center text-lg font-bold text-red-600 mbe-2 dark:text-red-500">
							{error}
						</p>
					)}

					<Form
						className="em:gap-3"
						onSubmit={e => {
							e.preventDefault()
							void handleSubmit(onSubmit, () => undefined)(e)
						}}
					>
						<Input
							label="Nome"
							disabled={inert}
							autoComplete="name"
							type="text"
							pattern="(?=.*[a-zA-Z0-9]).{2,}"
							error={errors.name?.message}
							minLength={2}
							required
							{...register('name')}
						/>
						<Input
							label="E-mail"
							autoComplete="username"
							type="email"
							required
							pattern="^[a-zA-Z0-9.!#$%&'*+\/=?^_`\{\|\}~\-]+@[a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?)*$"
							disabled={inert}
							error={errors.email?.message}
							{...register('email')}
						/>
						<Input
							label="Senha"
							type={type}
							autoComplete="new-password"
							disabled={inert}
							pattern={passwordRegex.source}
							required
							error={errors.password?.message}
							rightIcon={
								<Button
									variant="flat"
									disabled={inert}
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
						<Input
							label="Confirme sua senha"
							type={typeConfirm}
							disabled={inert}
							autoComplete="new-password"
							error={errors.password?.message}
							required
							pattern={passwordRegex.source}
							rightIcon={
								<Button
									disabled={inert}
									variant="flat"
									outline
									onClick={() => {
										setTypeConfirm(t =>
											t === 'password' ? 'text' : 'password'
										)
									}}
								>
									{type === 'password' ? <IoEye /> : <IoEyeOff />}
								</Button>
							}
							{...register('confirmPassword')}
						/>
						<div className="grid text-sm em:gap-1">
							<p>
								Já tem uma conta?&nbsp;
								<button
									type="button"
									disabled={inert}
									onClick={() => setForm('login')}
									className="m-0 cursor-pointer appearance-none border-none bg-transparent p-0 font-bold underline"
								>
									Entre
								</button>
							</p>
						</div>
						<div className="max grid auto-cols-fr grid-flow-row auto-rows-fr justify-end em:gap-3">
							<Button type="submit" disabled={inert} variant="success">
								Enviar
							</Button>
							<GoogleLoginButton text="signup" disabled={inert} />
						</div>
					</Form>
				</div>
			</div>
		)
	}
)

SignupForm.displayName = 'SignupForm'

export default SignupForm
