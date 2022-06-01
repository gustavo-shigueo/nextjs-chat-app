import { FC, RefObject } from 'react'
import { IoLogOutOutline } from 'react-icons/io5'

interface ISubmenuProps {
	submenuRef: RefObject<HTMLDivElement>
	closing: boolean
	className: string
	logout: () => Promise<void>
}

const Submenu: FC<ISubmenuProps> = ({
	submenuRef,
	closing,
	className,
	logout,
}) => (
	<nav ref={submenuRef} data-closing={closing} className={className}>
		<ul>
			<li>
				<button
					onClick={() => logout()}
					onKeyDown={({ key }) =>
						[' ', 'enter'].includes(key.toLowerCase()) && logout()
					}
					className="flex-space-between"
				>
					<span>Sair</span>
					<IoLogOutOutline fill="white" />
				</button>
			</li>
		</ul>
	</nav>
)

export default Submenu
