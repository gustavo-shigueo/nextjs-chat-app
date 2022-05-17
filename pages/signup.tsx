import Button from 'components/Button'
import Form from 'components/Form'
import Input from 'components/Input'
import { useAuth } from 'contexts/UserContext'
import { NextPage } from 'next'
import { useCallback } from 'react'
import { GoogleLogin } from '@react-oauth/google'
import style from 'styles/AuthForms.module.scss'
import emailRegex from 'utils/emailRegex'

const SignUp: NextPage = () => {
	const { signup, error, isAuthenticated, loading } = useAuth()

	const nameValidator = useCallback(({ length }) => length > 2, [])
	const emailValidator = useCallback(value => !!value.match(emailRegex), [])

	const passwordValidator = useCallback(
		value => value.length >= 8 && value.length <= 32,
		[]
	)

	const responseGoogle = async (response: any) => {
		const { credential: accessToken } = response

		signup({ googleAccessToken: accessToken })
	}

	return (
		<div className={style.formWrapper}>
			<h2>Signup</h2>
			<Form
				handleFormData={data => signup({ profile: data })}
				className={style.form}
			>
				<Input
					validator={nameValidator}
					required
					type="text"
					name="name"
					label="Name"
					errorMessage="Name must be between 3 and 50 characters long"
					valid={error?.field !== 'name'}
				/>
				<Input
					validator={emailValidator}
					required
					type="email"
					name="email"
					label="Email"
					errorMessage={error?.message || 'Invalid email'}
					valid={error?.field !== 'email'}
				/>
				<Input
					required
					validator={passwordValidator}
					type="password"
					name="password"
					label="Password"
					errorMessage="Password must be between 8 and 32 characters long"
					valid={error?.field !== 'password'}
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
					text="signup_with"
					auto_select={false}
				/>
			</div>
		</div>
	)
}

export default SignUp
