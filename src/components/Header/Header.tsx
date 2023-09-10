import { type Session } from 'next-auth'
import { signOut, useSession } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState, type MouseEventHandler } from 'react'
import {
	IoChevronDown,
	IoCreate,
	IoLogIn,
	IoLogOut,
	IoMoon,
	IoSunny,
} from 'react-icons/io5'
import useTheme from '../../hooks/useTheme'
import AuthFormsDialog from '../AuthFormsDialog'
import Avatar from '../Avatar/Avatar'
import { CollapsableMenu, CollapsableMenuItem } from '../CollapsableMenu'
import Portal from '../Portal'

function MenuTrigger({ session }: { session: Session | null }) {
	const Trigger = ({ isCollapsed }: { isCollapsed: boolean }) => {
		return (
			<>
				{session?.user && (
					<Avatar
						name={session.user.name ?? ''}
						imageUrl={session.user.image ?? ''}
					/>
				)}

				<IoChevronDown style={{ rotate: isCollapsed ? '0deg' : '180deg' }} />
			</>
		)
	}

	return Trigger
}

export default function Header() {
	const [theme, toggleTheme] = useTheme()
	const { locale = 'pt-br' } = useRouter()
	const { data: session } = useSession()
	const [dialog, setDialog] = useState<undefined | 'login' | 'signup'>()

	const openDialog =
		(d: 'login' | 'signup'): MouseEventHandler =>
		e => {
			e.stopPropagation()
			setDialog(d)
		}

	return (
		<>
			<header className="flex items-center justify-between border-solid border-neutral-500 bg-neutral-900 text-xl text-neutral-50 border-be-2 em:pli-8 em:plb-1">
				<h1>
					<Link href={`/${locale}`}>MiChat</Link>
				</h1>
				<CollapsableMenu role="navigation" trigger={MenuTrigger({ session })}>
					{session?.user ? (
						<>
							<CollapsableMenuItem
								leftIcon={theme === 'dark' ? <IoSunny /> : <IoMoon />}
								onClick={toggleTheme}
							>
								Mudar tema
							</CollapsableMenuItem>
							<CollapsableMenuItem
								onClick={() => void signOut({ callbackUrl: `/${locale}` })}
								leftIcon={<IoLogOut />}
							>
								Sair
							</CollapsableMenuItem>
						</>
					) : (
						<>
							<CollapsableMenuItem
								leftIcon={<IoLogIn />}
								onClick={openDialog('login')}
							>
								Entre
							</CollapsableMenuItem>
							<CollapsableMenuItem
								leftIcon={<IoCreate />}
								onClick={openDialog('signup')}
							>
								Cadastre-se
							</CollapsableMenuItem>
							<CollapsableMenuItem
								leftIcon={theme === 'dark' ? <IoSunny /> : <IoMoon />}
								onClick={toggleTheme}
							>
								Mudar tema
							</CollapsableMenuItem>
						</>
					)}
				</CollapsableMenu>
			</header>
			<Portal>
				<AuthFormsDialog form={dialog} setForm={setDialog} />
			</Portal>
		</>
	)
}
