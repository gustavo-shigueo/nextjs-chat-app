import { FC } from 'react'
import { FcGoogle } from 'react-icons/fc'
import { useGoogleLogin } from '@react-oauth/google'
import style from './GoogleLogin.module.scss'
import classNames from 'utils/classNames'
import Button from 'components/Button'

const GOOGLE_BUTTON_TEXT = {
	signin: 'Fazer login com o Google',
	signup: 'Increver-se com o Google',
	continue_with: 'Continuar com o Google',
}

interface CredentialResponse {
	access_token: string
	expires_in: number
	hd?: string
	prompt: string
	token_type: string
	scope: string
	state?: string
}

interface GoogleLoginProps {
	text: keyof typeof GOOGLE_BUTTON_TEXT
	onSuccess: (credentialResponse: CredentialResponse) => void
}

const GoogleLogin: FC<GoogleLoginProps> = ({ onSuccess, text }) => {
	const login = useGoogleLogin({ onSuccess })

	return (
		<Button
			className={classNames(style['google-btn'], 'padding-0')}
			type="button"
			onClick={() => login()}
		>
			<div className={style['google-icon']}>
				<FcGoogle />
			</div>
			<p className={classNames(style['google-text'], 'font-weight-bolder')}>
				{GOOGLE_BUTTON_TEXT[text]}
			</p>
		</Button>
	)
}

export default GoogleLogin
