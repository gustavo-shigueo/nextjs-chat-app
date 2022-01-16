import Button from 'components/Button'
import Form from 'components/Form'
import Input from 'components/Input'
import { NextPage } from 'next'
import GoogleLogin from 'react-google-login'
import style from 'styles/AuthForms.module.css'

const SignUp: NextPage = () => {
	const responseGoogle = (response: any) => {
		const { googleId, name, email, imageUrl } = response.profileObj
		console.log({ googleId, name, email, imageUrl })
	}

	return (
		<div className={style.formWrapper}>
			<h2>Signup</h2>
			<Form handleFormData={data => console.log(data)} className={style.form}>
				<Input
					validator={value => {
						return value.length > 2
					}}
					required
					type="text"
					name="name"
					label="Name"
					errorMessage="Name must be at least 3 characters long"
					valid={/* Insert validation from backend here */ true}
				/>
				<Input
					validator={value => {
						const r =
							/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)+$/

						return !!value.match(r)
					}}
					required
					type="email"
					name="email"
					label="Email"
					errorMessage="Invalid email"
					valid={/* Insert validation from backend here */ true}
				/>
				<Input
					required
					validator={value => value.length >= 8 && value.length <= 32}
					type="password"
					name="password"
					label="Password"
					errorMessage="Password must be between 8 and 32 characters long"
					valid={/* Insert validation from backend here */ true}
				/>
				<Button type="submit" text="Submit" />
			</Form>

			<div className={style.separator}>or</div>

			<div className={style.social}>
				<GoogleLogin
					clientId={process.env.NEXT_PUBLIC_GOOGLE_OAUTH_CLIENT_ID!}
					buttonText="Sign up with Google"
					onSuccess={responseGoogle}
					style={{ width: '100%' }}
					onFailure={console.log}
					cookiePolicy="single_host_origin"
				/>
			</div>
		</div>
	)
}

export default SignUp
