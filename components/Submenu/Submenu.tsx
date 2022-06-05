import { FC, RefObject } from 'react'

interface ISubmenuProps {
	submenuRef: RefObject<HTMLDivElement>
	closing: boolean
	className: string
}

const Submenu: FC<ISubmenuProps> = ({
	submenuRef,
	closing,
	className,
	children,
}) => (
	<nav ref={submenuRef} data-closing={closing} className={className}>
		<ul>{children}</ul>
	</nav>
)

export default Submenu
