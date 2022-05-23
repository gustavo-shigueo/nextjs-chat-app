import LinkButton from 'components/LinkButton'
import Link from 'next/link'
import React from 'react'
import styles from './Header.module.scss'

const Header = () => {
	return (
		<header className={styles.header}>
			<span role="logo">
				<Link href="/">MiChat</Link>
			</span>

			<nav>
				<ul>
					<li>
						<LinkButton href="/login" variant="primary" shallow>
							Entre
						</LinkButton>
					</li>
					<li>
						<LinkButton href="/signup" variant="outline-accent" shallow>
							Cadastre-se
						</LinkButton>
					</li>
				</ul>
			</nav>
		</header>
	)
}

export default Header
