import { signIn } from 'next-auth/react'
import { type FC } from 'react'
import { FcGoogle } from 'react-icons/fc'
import Button from '../Button'

const GOOGLE_BUTTON_TEXT = {
	signin: 'Fazer login com o Google',
	signup: 'Increver-se com o Google',
	continue_with: 'Continuar com o Google',
}

interface GoogleLoginProps {
	text: keyof typeof GOOGLE_BUTTON_TEXT
	disabled?: boolean
}

function login() {
	void signIn('google', { callbackUrl: '/dashboard' })
}

const GoogleLogin: FC<GoogleLoginProps> = ({ text, disabled }) => {
	return (
		<Button
			className="rounded border-none bg-[hsl(215_80%_50%)] p-0 text-white transition-colors min-is-[100%] mli-auto hover:bg-[hsl(215_80%_60%)]"
			type="button"
			disabled={disabled}
			variant="none"
			onClick={login}
			style={{ padding: '0' }}
			leftIcon={
				<div className="grid aspect-square place-items-center self-stretch rounded-[inherit] rounded-r-none bg-white text-xl">
					<FcGoogle className="[translate:-2.5%_5%]" />
				</div>
			}
		>
			<p className="font-bold">{GOOGLE_BUTTON_TEXT[text]}</p>
		</Button>
	)
}

export default GoogleLogin
