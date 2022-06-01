import { IoChevronDown } from 'react-icons/io5'
import Image from 'next/image'
import { FC, useRef, useState } from 'react'
import classNames from 'utils/classNames'
import style from './Avatar.module.scss'
import IUser from 'interfaces/IUser'
import useEventListener from 'hooks/useEventListener'
import Submenu from 'components/Submenu'

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

	return (
		<div
			tabIndex={0}
			ref={toggleRef}
			onClick={() => {
				if (!submenuOpen) return setSubmenuOpen(true)
				setClosing(true)
			}}
			onKeyDown={e => {
				if (['enter', ' '].includes(e.key.toLowerCase())) {
					e.preventDefault()
					setSubmenuOpen(o => !o)
				}
			}}
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

				<button className={classNames(style['avatar-btn'])} tabIndex={-1}>
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
					{
						hide: !submenuOpen,
					}
				)}
				logout={logout}
			/>
		</div>
	)
}

export default Avatar
