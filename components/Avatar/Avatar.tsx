import Button from 'components/Button'
import CollapsableMenu from 'components/CollapsableMenu'
import IUser from 'interfaces/IUser'
import Image from 'next/image'
import { FC, ReactNode, useId } from 'react'
import { IoChevronDown, IoLogOutOutline } from 'react-icons/io5'
import classNames from 'utils/classNames'
import style from './Avatar.module.scss'

interface AvatarProps {
	user: IUser
	logout: () => Promise<void>
}

interface AvatarMenuOption extends AvatarMenuItemProps {
	id: string
}

const Avatar: FC<AvatarProps> = ({ user, logout }) => {
	const id = useId()

	return (
		<CollapsableMenu<AvatarMenuOption>
			isNav={true}
			menuOptions={[
				{
					id: `${id}0`,
					icon: <IoLogOutOutline fill="white" />,
					onClick: () => logout(),
					text: 'Sair',
				},
			]}
			render={i => <AvatarMenuItem {...i} />}
			trigger={({ isOpen, isClosing }) => (
				<AvatarMenuTrigger user={user} isOpen={isOpen} isClosing={isClosing} />
			)}
		/>
	)
}

interface AvatarMenuItemProps {
	onClick: () => void
	text: string
	icon: ReactNode
}

const AvatarMenuItem: FC<AvatarMenuItemProps> = ({ onClick, icon, text }) => {
	return (
		<Button
			onClick={onClick}
			variant="flat"
			onKeyDown={({ key }) =>
				[' ', 'enter'].includes(key.toLowerCase()) && onClick()
			}
			className="flex-space-between"
		>
			<span>{text}</span>
			{icon}
		</Button>
	)
}

export default Avatar

interface AvatarMenuTriggerProps {
	isOpen: boolean
	isClosing: boolean
	user: IUser
}
const AvatarMenuTrigger: FC<AvatarMenuTriggerProps> = ({
	isOpen,
	isClosing,
	user,
}) => (
	<>
		<span>{user.name}</span>

		<Image
			className="border-radius-full box-shadow-small"
			width={30}
			height={30}
			src={user.avatarUrl}
			alt="User avatar"
		/>
		<button
			className={classNames(style['avatar-btn'])}
			tabIndex={-1}
			aria-label="Your avatar"
		>
			<IoChevronDown
				style={{
					transform: `translateY(15%) rotate(${
						isOpen && !isClosing ? 180 : 0
					}deg)`,
					transition: 'transform 150ms ease-in-out',
				}}
			/>
		</button>
	</>
)
