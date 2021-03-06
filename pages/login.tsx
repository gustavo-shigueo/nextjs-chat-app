import { useAuth } from 'contexts/UserContext'
import style from 'styles/AuthForms.module.scss'
import { GetServerSideProps, NextPage } from 'next'
import Form from 'components/Form'
import Button from 'components/Button'
import Input, { InputValidator } from 'components/Input'
import emailRegex from 'utils/emailRegex'
import { useCallback } from 'react'
import authGuard from 'guards/autth/authGuard'
import GoogleLogin from 'components/GoogleLogin'

const LogIn: NextPage = () => {
	const { login, error, loading } = useAuth()
	const emailValidator: InputValidator = useCallback(
		value => [!!value.match(emailRegex), 'Invalid e-mail'],
		[]
	)

	const passwordValidator: InputValidator = useCallback(
		value => [
			value.length >= 8 && value.length <= 32,
			'Password must be between 8 and 32 characters long',
		],
		[]
	)

	const responseGoogle = async (response: any) => {
		const { access_token: googleAccessToken } = response

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
					serverErrorMessage={error?.message}
					serverValid={!error?.fields?.includes('email')}
				/>
				<Input
					required
					validator={passwordValidator}
					type="password"
					name="password"
					label="Password"
					serverErrorMessage={error?.message}
					serverValid={!error?.fields?.includes('password')}
				/>
				<Button type="submit" loading={loading}>
					Submit
				</Button>
			</Form>

			<div className={style.separator}>or</div>

			<div className={style.social}>
				<GoogleLogin onSuccess={responseGoogle} text="signin" />
			</div>
		</div>
	)
}

export default LogIn

export const getServerSideProps: GetServerSideProps = async ctx => {
	try {
		const authenticatedUserData = await authGuard(ctx)

		return {
			props: {
				authenticatedUserData,
			},
			redirect: {
				destination: '/dashboard',
				permanent: false,
			},
		}
	} catch (error: any) {
		return {
			props: {
				authenticatedUserData: {
					serverSideAccessToken: null,
					serverSideUser: null,
					serverSideError: error,
				},
			},
		}
	}
}
