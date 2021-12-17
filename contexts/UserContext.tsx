import { createContext, useContext, useState, FC } from 'react'
import UserInterface from 'interfaces/UserInterface'
import GoogleProfileInterface from 'interfaces/GoogleProfileInterface'
import UserLoginData from 'interfaces/UserLoginData'

interface UserContextData {
	isAuthenticated: boolean
	user: UserInterface | null
}

const UserContext = createContext({} as UserContextData)

/**
 * Returns the UserContext data
 */
const useAuth = () => useContext(UserContext)

export const UserProvider: FC = ({ children }) => {
	const [user, setUser] = useState<UserInterface | null>(null)
	const [loading, setLoading] = useState(true)

	// TODO: implement login, logout and signup
	const login = async (
		profile?: UserLoginData,
		googleProfile?: GoogleProfileInterface
	) => {
		if (profile) {
		}

		if (googleProfile) {
		}

		console.error('No login data provided')
	}

	const logout = async () => {
		// await logoutLogic(args)
		// setUser(null)
	}

	const signup = async () => {
		// const u: User = await signupLogic(args)
	}

	return (
		<UserContext.Provider
			value={{
				user,
				isAuthenticated: !!user,
			}}
		>
			{children}
		</UserContext.Provider>
	)
}
