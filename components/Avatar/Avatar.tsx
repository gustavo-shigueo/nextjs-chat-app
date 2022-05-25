import { IoChevronDown } from 'react-icons/io5'
import User from 'entities/User'
import Image from 'next/image'
import { FC } from 'react'
import classNames from 'utils/classNames'
import style from './Avatar.module.scss'

interface AvatarProps {
	user: User
}

const Avatar: FC<AvatarProps> = ({ user }) => {
	return (
		<div className={classNames(style.avatar)}>
			{user.name}
			<Image
				className="border-radius-full"
				width={30}
				height={30}
				src={user.avatarUrl}
				alt="User avatar"
			/>
			<IoChevronDown />
		</div>
	)
}

export default Avatar
