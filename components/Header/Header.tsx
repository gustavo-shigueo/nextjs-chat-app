import Avatar from 'components/Avatar'
import LinkButton from 'components/LinkButton'
import { useAuth } from 'contexts/UserContext'
import Link from 'next/link'
import React from 'react'
import classNames from 'utils/classNames'
import styles from './Header.module.scss'

const Header = () => {
	const { user } = useAuth()
	return (
		<header className={classNames('font-size-500', 'fullbleed', styles.header)}>
			<span role="logo">
				<Link href="/">MiChat</Link>
			</span>

			<nav>
				<ul>
					{user ? (
						<li>
							<Avatar user={user} />
						</li>
					) : (
						<>
							<li>
								<LinkButton href="/login" variant="outline-primary" shallow>
									Entre
								</LinkButton>
							</li>
							<li>
								<LinkButton href="/signup" variant="outline-accent" shallow>
									Cadastre-se
								</LinkButton>
							</li>
						</>
					)}
				</ul>
			</nav>
		</header>
	)
}

export default Header
