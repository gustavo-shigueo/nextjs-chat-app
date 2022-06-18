import { FC } from 'react'
import classNames from 'utils/classNames'
import timeFormatter from 'utils/formatters/time'
import style from './MessageListItem.module.scss'

interface IMessageListItemProps {
	text: string
	sentAt: Date
	sent: boolean
}

const MessageListItem: FC<IMessageListItemProps> = ({ sent, sentAt, text }) => {
	return (
		<div
			className={classNames('box-shadow-small', style.message, {
				[style['message-sent']]: sent,
				[style['message-received']]: !sent,
			})}
		>
			<p>{text}</p>
			<time>{timeFormatter.format(sentAt)}</time>
		</div>
	)
}

export default MessageListItem
