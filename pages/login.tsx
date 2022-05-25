import { IUserProviderProps, useAuth } from 'contexts/UserContext'
import style from 'styles/AuthForms.module.scss'
import { GetServerSideProps, NextPage } from 'next'
import Form from 'components/Form'
import Button from 'components/Button'
import Input, { InputValidator } from 'components/Input'
import emailRegex from 'utils/emailRegex'
import { useCallback } from 'react'
import { GoogleLogin } from '@react-oauth/google'
import { User } from '@prisma/client'
import api from 'services/axios'

const LogIn: NextPage = () => {
	const { user, login, error, loading, isAuthenticated } = useAuth()
	const emailValidator: InputValidator = useCallback(
		value => [!!value.match(emailRegex), 'Invalid e-mail'],
		[]
	)

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
					serverErrorMessage={error?.message}
					serverValid={!error?.fields?.includes('email')}
				/>
				<Input
					required
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

export const getServerSideProps: GetServerSideProps<{
	initialData: IUserProviderProps
}> = async ctx => {
	try {
		const { data, headers } = await api.post<User>('/me', {}, {
			withCredentials: true,
			headers: { Cookie: ctx.req.headers.cookie },
		} as any)

		ctx.res.setHeader('set-cookie', Object.freeze(headers['set-cookie'] ?? []))

		return {
			props: {
				initialData: {
					serverSideUser: data,
					serverSideAccessToken: headers.authorization,
					serverSideError: null,
				},
			},
		}
	} catch (error: any) {
		return {
			props: {
				initialData: {
					serverSideAccessToken: null,
					serverSideUser: null,
					serverSideError: error.response?.data ?? null,
				},
			},
		}
	}
}
