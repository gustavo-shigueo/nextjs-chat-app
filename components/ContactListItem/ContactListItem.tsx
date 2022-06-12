import Button from 'components/Button'
import IContact from 'interfaces/IContact'
import Image from 'next/image'
import { FC } from 'react'
import classNames from 'utils/classNames'
import parseDateDifference from 'utils/parseDateDifference'
import style from './ContactListItem.module.scss'

interface IContactListItemProps {
	contact: IContact
}

const ContactList: FC<IContactListItemProps> = ({
	contact: { name, avatarUrl, lastMessage },
}) => {
	return (
		<Button variant="flat" className={classNames(style['contact-list-item'])}>
			<div className={classNames(style['contact-avatar'])}>
				<Image
					layout="fill"
					src={avatarUrl}
					alt={`${name}'s profile picture`}
				/>
			</div>
			<p className={classNames(style['contact-name'])}>{name}</p>
			<div className={classNames(style['contact-latest-message'])}>
				<p className={classNames(style['message-text'])}>{lastMessage.text}</p>
				<p className={classNames(style['message-date'])}>
					{parseDateDifference(lastMessage.sentAt)}
				</p>
			</div>
		</Button>
	)
}

export default ContactList
