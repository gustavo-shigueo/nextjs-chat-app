import { NextPage } from 'next'
import GoogleLogin from 'react-google-login'

const Test: NextPage = () => {
	const responseGoogle = (response: any) => {
		const { googleId, name, email, imageUrl } = response.profileObj
		console.log({ googleId, name, email, imageUrl })
	}

	return (
		<div>
			<GoogleLogin
				clientId={process.env.NEXT_PUBLIC_GOOGLE_OAUTH_CLIENT_ID!}
				buttonText="Sign in with Google"
				onSuccess={responseGoogle}
				onFailure={console.log}
				cookiePolicy="single_host_origin"
			/>
		</div>
	)
}

export default Test
