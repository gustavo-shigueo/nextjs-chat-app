import { FC } from 'react'
import { FcGoogle } from 'react-icons/fc'
import { useGoogleLogin, GoogleLogin as B } from '@react-oauth/google'
import style from './GoogleLogin.module.scss'
import classNames from 'utils/classNames'

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
	text: 'signin' | 'signup' | 'continue_with'
	onSuccess: (credentialResponse: CredentialResponse) => void
}

const GoogleLogin: FC<GoogleLoginProps> = ({ onSuccess, text }) => {
	const login = useGoogleLogin({ onSuccess })
	const getText = () => {
		switch (text) {
			case 'signin':
				return 'Fazer login com o Google'
			case 'signup':
				return 'Increver-se com o Google'
			case 'continue_with':
				return 'Continuar com o Google'
			default:
				const _: never = text
				if (_) throw new Error()
		}
	}

	return (
		<button className={classNames(style['google-btn'])} onClick={() => login()}>
			<div className={style['google-icon']}>
				<FcGoogle />
			</div>
			<p className={classNames(style['google-text'], 'text-bolder')}>
				{getText()}
			</p>
		</button>
	)
}

export default GoogleLogin
