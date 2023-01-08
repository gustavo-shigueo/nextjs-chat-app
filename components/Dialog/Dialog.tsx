import Button from 'components/Button'
import useEventListener from 'hooks/useEventListener'
import { DialogHTMLAttributes, forwardRef, useRef } from 'react'
import { IoClose } from 'react-icons/io5'
import classNames from 'utils/classNames'
import styles from './Dialog.module.scss'

interface DialogProps extends DialogHTMLAttributes<HTMLDialogElement> {}

const Dialog = forwardRef<HTMLDialogElement, DialogProps>(
	({ children, title, className, ...props }, ref) => {
		const localRef = useRef<HTMLDialogElement | null>(null)

		const closeDialog = () => {
			if (!localRef.current) return
			localRef.current.dataset.closing = 'true'
		}

		useEventListener(
			'animationend',
			e => {
				if (!localRef.current) return

				localRef.current.dataset.closing = 'false'

				if (!e.animationName.includes('close')) return
				localRef.current?.close()
			},
			localRef
		)

		useEventListener(
			'click',
			e => {
				if (!localRef.current?.open) return

				const { x, y, height, width } = localRef.current.getBoundingClientRect()
				if (e.x < x || e.y < y || e.x > x + width || e.y > y + height) {
					closeDialog()
				}
			},
			localRef
		)

		return (
			<dialog
				className={classNames(className, styles.dialog)}
				ref={node => {
					localRef.current = node

					if (typeof ref === 'function') ref(node)
					else if (ref) ref.current = node
				}}
				{...props}
			>
				<header>
					{title && <h3>{title}</h3>}
					<Button
						variant="flat"
						className="margin-inline-start-auto"
						onClick={() => closeDialog()}
					>
						<IoClose />
					</Button>
				</header>
				<section className={styles.content}>{children}</section>
			</dialog>
		)
	}
)

Dialog.displayName = 'Dialog'
export default Dialog
