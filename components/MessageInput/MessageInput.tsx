import { IoSend } from 'react-icons/io5'
import Button from 'components/Button'
import style from './MessageInput.module.scss'

const MessageInput = () => {
	return (
		<div className={style['message-input-group']}>
			<form onSubmit={e => e.preventDefault()}>
				<textarea
					placeholder="Mensagem..."
					className={style['message-input']}
				/>
				<Button className="border-radius-full" aria-label="Send">
					<IoSend />
				</Button>
			</form>
		</div>
	)
}

export default MessageInput
