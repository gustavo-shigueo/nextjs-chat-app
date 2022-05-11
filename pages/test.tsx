import { NextPage } from 'next'
import GoogleLogin from 'react-google-login'

const Test: NextPage = () => {
	const responseGoogle = (response: any) => {
		const { googleId, name, email, imageUrl } = response.profileObj
	}

	return (
		<div>
			<GoogleLogin
				clientId={process.env.NEXT_PUBLIC_GOOGLE_OAUTH_CLIENT_ID!}
				buttonText="Sign in with Google"
				onSuccess={responseGoogle}
				onFailure={console.error}
				cookiePolicy="single_host_origin"
			/>
		</div>
	)
}

export default Test
