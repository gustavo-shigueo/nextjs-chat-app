import Image from 'next/image'
import { FC } from 'react'
import style from './ChatHeader.module.scss'
import classNames from 'utils/classNames'
import IChat from 'interfaces/IChat'

interface IChatHeaderProps {
	chat: IChat | undefined
}

const ContactHeader: FC<IChatHeaderProps> = ({ chat }) => {
	return (
		<header
			className={classNames('bg-color-neutral-200', style['contact-info'])}
		>
			{chat ? (
				<>
					<Image
						src={chat?.thumbnailUrl ?? ''}
						alt={`${chat?.name}'s avatar`}
						width={30}
						height={30}
					/>
					<h2>{chat.name}</h2>
				</>
			) : (
				<div style={{ height: 30 }} />
			)}
		</header>
	)
}

export default ContactHeader
