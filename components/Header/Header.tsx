import Button from 'components/Button'
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
						<Button tabIndex={-1}>
							<Link href="/login">Entre</Link>
						</Button>
					</li>
					<li>
						<Button tabIndex={-1} variant="outline-accent">
							<Link href="/signup">Cadastre-se</Link>
						</Button>
					</li>
				</ul>
			</nav>
		</header>
	)
}

export default Header
