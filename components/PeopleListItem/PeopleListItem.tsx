import Button from 'components/Button'
import IContact from 'interfaces/IContact'
import IPublicUserData from 'interfaces/IPublicUserData'
import Image from 'next/image'
import { FC } from 'react'
import classNames from 'utils/classNames'
import parseDateDifference from 'utils/parseDateDifference'
import style from './PeopleListItem.module.scss'

interface IPeopleListItemProps {
	person: IContact | IPublicUserData
}

const PeopleListItem: FC<IPeopleListItemProps> = ({ person }) => {
	const { name, avatarUrl, onlineStatus } = person
	return (
		<Button variant="flat" className={classNames(style['contact-list-item'])}>
			<div
				className={classNames('relative', style['contact-avatar'])}
				style={{
					color: `var(--color-${onlineStatus ? 'success' : 'danger'}-400)`,
				}}
			>
				<Image
					layout="fill"
					src={avatarUrl}
					alt={`${name}'s profile picture`}
				/>
			</div>
			<p className={classNames(style['contact-name'])}>{name}</p>
			{'lastMessage' in person && (
				<div className={classNames(style['contact-latest-message'])}>
					<p className={classNames(style['message-text'])}>
						{person.lastMessage.text}
					</p>
					<p className={classNames(style['message-date'])}>
						{parseDateDifference(person.lastMessage.sentAt)}
					</p>
				</div>
			)}
		</Button>
	)
}

export default PeopleListItem
