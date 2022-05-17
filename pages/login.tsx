import { useAuth } from 'contexts/UserContext'
import style from 'styles/AuthForms.module.scss'
import { NextPage } from 'next'
import Form from 'components/Form'
import Button from 'components/Button'
import Input from 'components/Input'
import emailRegex from 'utils/emailRegex'
import { useCallback } from 'react'
import { GoogleLogin } from '@react-oauth/google'

const LogIn: NextPage = () => {
	const { user, login, error, loading, isAuthenticated } = useAuth()
	const emailValidator = useCallback(value => !!value.match(emailRegex), [])

	const responseGoogle = async (response: any) => {
		const { credential: googleAccessToken } = response

		login({ googleAccessToken })
	}

	return (
		<div className={style.formWrapper}>
			<h2>Login</h2>
			<Form
				handleFormData={data => login({ profile: data })}
				className={style.form}
			>
				<Input
					validator={emailValidator}
					required
					type="email"
					name="email"
					label="Email"
					errorMessage={error?.message ?? 'Invalid e-mail'}
					valid={!error}
				/>
				<Input
					required
					type="password"
					name="password"
					label="Password"
					errorMessage={error?.message}
					valid={!error}
				/>
				<Button type="submit" loading={loading}>
					Submit
				</Button>
			</Form>

			<div className={style.separator}>or</div>

			<div className={style.social}>
				<GoogleLogin
					onSuccess={responseGoogle}
					onError={console.error}
					text="signin"
					auto_select={false}
				/>
			</div>
		</div>
	)
}

export default LogIn
