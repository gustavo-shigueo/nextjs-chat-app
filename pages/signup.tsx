import Button from 'components/Button'
import Form from 'components/Form'
import Input, { InputValidator } from 'components/Input'
import { useAuth } from 'contexts/UserContext'
import { GetServerSideProps, NextPage } from 'next'
import { useCallback } from 'react'
import GoogleLogin from 'components/GoogleLogin'
import style from 'styles/AuthForms.module.scss'
import emailRegex from 'utils/emailRegex'
import authGuard from 'guards/autth/authGuard'

const SignUp: NextPage = () => {
	const { signup, error, loading } = useAuth()

	const nameValidator: InputValidator = useCallback(
		({ length }) => [length > 2, 'Name must be at least 3 characters long'],
		[]
	)
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
		const { credential: accessToken } = response

		signup({ googleAccessToken: accessToken })
	}

	return (
		<div className={style.formWrapper}>
			<h2>Cadastre-se</h2>
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
					serverErrorMessage={error?.message}
					serverValid={!error?.fields?.includes('name')}
				/>
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
				<Button type="submit" loading={loading} variant="primary">
					Submit
				</Button>
			</Form>

			<div className={style.separator}>or</div>

			<div className={style.social}>
				<GoogleLogin onSuccess={responseGoogle} text="signup" />
			</div>
		</div>
	)
}

export const getServerSideProps: GetServerSideProps = async ctx => {
	try {
		const authenticatedUserData = await authGuard(ctx)

		return {
			props: {
				authenticatedUserData,
			},
			redirect: {
				destination: 'dashboard',
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

export default SignUp
