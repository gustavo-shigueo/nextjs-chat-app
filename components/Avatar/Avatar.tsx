import { IoChevronDown, IoLogOutOutline } from 'react-icons/io5'
import Image from 'next/image'
import { FC, KeyboardEventHandler, useRef, useState } from 'react'
import classNames from 'utils/classNames'
import style from './Avatar.module.scss'
import IUser from 'interfaces/IUser'
import useEventListener from 'hooks/useEventListener'
import Submenu from 'components/Submenu'
import SubmenuItem from 'components/SubmenuItem'
import Button from 'components/Button'

interface AvatarProps {
	user: IUser
	logout: () => Promise<void>
}

const Avatar: FC<AvatarProps> = ({ user, logout }) => {
	const toggleRef = useRef<HTMLDivElement | null>(null)
	const submenuRef = useRef<HTMLDivElement | null>(null)
	const [submenuOpen, setSubmenuOpen] = useState(false)
	const [closing, setClosing] = useState(false)

	const handleBlur = (e: FocusEvent) => {
		if (!submenuOpen) return

		const tabbedTo = e.relatedTarget as HTMLElement
		if (!toggleRef.current?.contains(tabbedTo)) return setClosing(true)

		tabbedTo?.addEventListener('blur', handleBlur, { once: true })
	}

	useEventListener('blur', handleBlur, toggleRef)

	useEventListener(
		'animationend',
		() => {
			if (!closing) return

			setClosing(false)
			setSubmenuOpen(false)
		},
		submenuRef
	)

	const handleKeyDown: KeyboardEventHandler<HTMLDivElement> = e => {
		if (!['enter', ' '].includes(e.key.toLowerCase())) return

		e.preventDefault()
		setSubmenuOpen(o => !o)
	}

	const handleClick = () => {
		const setState = submenuOpen ? setClosing : setSubmenuOpen
		setState(true)
	}

	return (
		<div
			tabIndex={0}
			ref={toggleRef}
			onClick={handleClick}
			onKeyDown={handleKeyDown}
			className={classNames(style.avatar, 'relative')}
		>
			<span>
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
								submenuOpen && !closing ? 180 : 0
							}deg)`,
							transition: 'transform 150ms ease-in-out',
						}}
					/>
				</button>
			</span>

			<Submenu
				submenuRef={submenuRef}
				closing={closing}
				className={classNames(
					'absolute',
					'text-bold',
					style['avatar-submenu'],
					{ hide: !submenuOpen }
				)}
			>
				<SubmenuItem>
					<Button
						onClick={() => logout()}
						variant="flat"
						onKeyDown={({ key }) =>
							[' ', 'enter'].includes(key.toLowerCase()) && logout()
						}
						className="flex-space-between"
					>
						<span>Sair</span>
						<IoLogOutOutline fill="white" />
					</Button>
				</SubmenuItem>
			</Submenu>
		</div>
	)
}

export default Avatar
