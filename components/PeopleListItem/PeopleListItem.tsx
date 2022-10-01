import Button from 'components/Button'
import { useAuth } from 'contexts/UserContext'
import IChat from 'interfaces/IChat'
import Image from 'next/image'
import { FC, MouseEventHandler } from 'react'
import classNames from 'utils/classNames'
import parseDateDifference from 'utils/parseDateDifference'
import style from './PeopleListItem.module.scss'

interface IPeopleListItemProps {
	chat: IChat
	onClick?: MouseEventHandler
}

const PeopleListItem: FC<IPeopleListItemProps> = ({ chat, onClick }) => {
	const {
		chatType,
		name,
		thumbnailUrl,
		createdAt,
		users,
		messages: [lastMessage],
	} = chat
	const { user } = useAuth()

	return (
		<Button
			variant="flat"
			onClick={onClick}
			className={classNames(style['contact-list-item'])}
		>
			<div
				className={classNames('relative', style['contact-avatar'])}
				style={{
					color:
						chatType === 'PrivateChat'
							? `var(--color-${
									users?.find(u => u.id !== user?.id)?.onlineStatus
										? 'success'
										: 'danger'
							  }-400)`
							: 'transparent',
				}}
			>
				<Image
					layout="fill"
					src={
						chatType === 'PrivateChat'
							? users?.find(u => u.id !== user?.id)?.avatarUrl ?? ''
							: thumbnailUrl ?? ''
					}
					alt={`${name}'s profile picture`}
				/>
			</div>
			<p className={classNames(style['contact-name'])}>{name}</p>
			{'lastMessage' in chat && (
				<div className={classNames(style['contact-latest-message'])}>
					<p className={classNames(style['message-text'])}>
						{lastMessage.text}
					</p>
					<p className={classNames(style['message-date'])}>
						{parseDateDifference(lastMessage.sentAt)}
					</p>
				</div>
			)}
		</Button>
	)
}

export default PeopleListItem
