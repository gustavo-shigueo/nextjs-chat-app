import Image from 'next/image'
import IContact from 'interfaces/IContact'
import { FC } from 'react'
import style from './ContactHeader.module.scss'
import classNames from 'utils/classNames'

interface IContactHeaderProps {
	contact: IContact | undefined
}

const ContactHeader: FC<IContactHeaderProps> = ({ contact }) => {
	return (
		<header
			className={classNames('bg-color-neutral-200', style['contact-info'])}
		>
			{contact ? (
				<>
					<Image
						src={contact?.avatarUrl ?? ''}
						alt={`${contact?.name}'s avatar`}
						width={30}
						height={30}
					/>
					<h2>{contact.name}</h2>
				</>
			) : (
				<div />
			)}
		</header>
	)
}

export default ContactHeader
