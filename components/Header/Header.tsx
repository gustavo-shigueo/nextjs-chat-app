import AuthFormsDialog from 'components/AuthFormsDialog'
import Avatar from 'components/Avatar'
import {
	CollapsableMenu,
	CollapsableMenuItem,
} from 'components/CollapsableMenu'
import { useAuth } from 'contexts/UserContext'
import useTheme from 'hooks/useTheme'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { FC, MouseEvent, useEffect, useState } from 'react'
import { IoCreate, IoLogIn, IoLogOut, IoMoon, IoSunny } from 'react-icons/io5'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

interface HeaderProps {}

const Header: FC<HeaderProps> = () => {
	const [theme, toggleTheme] = useTheme()
	const [dialog, setDialog] = useState<undefined | 'login' | 'signup'>()
	const { user, logout, error } = useAuth()
	const { locale } = useRouter()

	const openDialog = (d: 'login' | 'signup') => (e: MouseEvent) => {
		e.stopPropagation()
		setDialog(d)
	}

	useEffect(() => {
		;(async () => {
			if (!error?.name) return

			if (locale?.includes('en')) {
				toast.error(error.message)
				return
			}

			const translation = await import(`./errors/${locale}.json`)
			toast.error(translation[error.name])
		})()
	}, [error?.message, error?.name, locale])

	return (
		<>
			<header className="flex justify-content-space-between align-items-center | padding-inline-800 padding-block-300 background-neutral-200 text-neutral-900 font-size-500">
				<h1>
					<Link href="/">MiChat</Link>
				</h1>

				<CollapsableMenu
					role="navigation"
					trigger={user && <Avatar user={user} />}
				>
					{user ? (
						<>
							<CollapsableMenuItem rightIcon={<IoLogOut />} onClick={logout}>
								Sair
							</CollapsableMenuItem>
							<CollapsableMenuItem
								rightIcon={theme === 'dark' ? <IoSunny /> : <IoMoon />}
								onClick={toggleTheme}
							>
								Mudar tema
							</CollapsableMenuItem>
						</>
					) : (
						<>
							<CollapsableMenuItem
								rightIcon={<IoLogIn />}
								onClick={openDialog('login')}
							>
								Entre
							</CollapsableMenuItem>
							<CollapsableMenuItem
								rightIcon={<IoCreate />}
								onClick={openDialog('signup')}
							>
								Cadastre-se
							</CollapsableMenuItem>
							<CollapsableMenuItem
								rightIcon={theme === 'dark' ? <IoSunny /> : <IoMoon />}
								onClick={toggleTheme}
							>
								Mudar tema
							</CollapsableMenuItem>
						</>
					)}
				</CollapsableMenu>
			</header>
			<AuthFormsDialog form={dialog} setForm={setDialog} />
			<ToastContainer
				position="top-right"
				pauseOnHover
				closeOnClick
				autoClose={5000}
				draggable
				theme={theme}
				pauseOnFocusLoss={false}
			/>
		</>
	)
}

export default Header
