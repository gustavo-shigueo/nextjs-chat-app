import IUser from 'interfaces/IUser'
import { FC } from 'react'
import styles from './Avatar.module.scss'
import Image from 'next/image'

interface AvatarProps {
	user: IUser
}

const Avatar: FC<AvatarProps> = ({ user: { name, avatarUrl } }) => (
	<span className={styles.avatar}>
		<Image
			src={avatarUrl}
			width={32}
			height={32}
			className="border-radius-full"
			alt={`${name}'s avatar`}
		/>
		<p>{name}</p>
	</span>
)

export default Avatar
