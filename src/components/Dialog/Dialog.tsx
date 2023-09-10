import { forwardRef, useRef, type DialogHTMLAttributes } from 'react'
import { IoClose } from 'react-icons/io5'
import { twMerge } from 'tailwind-merge'
import useEventListener from '../../hooks/useEventListener'
import Button from '../Button'

type DialogProps = DialogHTMLAttributes<HTMLDialogElement>

const Dialog = forwardRef<HTMLDialogElement, DialogProps>(
	({ children, className, title, ...props }, ref) => {
		const localRef = useRef<HTMLDialogElement | null>(null)

		const closeDialog = () => {
			if (!localRef.current) return

			localRef.current
				.animate(
					[
						{
							insetBlockStart: 0,
							transform: 'translate(-50%, -100%)',
						},
					],
					{ fill: 'backwards' }
				)
				.addEventListener(
					'finish',
					() => {
						localRef.current?.close()
					},
					{ once: true }
				)
		}

		useEventListener(
			'click',
			e => {
				// Can only close a dialog if it is open
				if (!localRef.current?.open) return

				// Detects that the click event was fired by hitting
				// Enter or Space while focusing a button inside the
				// dialog and prevents that from closing it
				if (e.detail === 0) return

				const { x, y, height, width } = localRef.current.getBoundingClientRect()
				if (e.x < x || e.y < y || e.x > x + width || e.y > y + height) {
					closeDialog()
				}
			},
			localRef
		)

		return (
			<dialog
				className={twMerge(
					'fixed m-0 translate-x-[-50%] translate-y-[-100%] overflow-hidden rounded-lg border-none bg-neutral-100 p-0 text-inherit min-bs-0 max-bs-[90svb] is-[min(90svi,_50em)] max-is-[50ch] inline-start-[50%] block-start-0 backdrop:bg-neutral-900 backdrop:opacity-0 backdrop:transition-opacity open:translate-y-[-50%] open:block-start-[50%] open:backdrop:opacity-75 motion-safe:transition-[inset-block-start,_transform] dark:bg-neutral-800',
					className
				)}
				ref={node => {
					localRef.current = node

					if (typeof ref === 'function') ref(node)
					else if (ref) ref.current = node
				}}
				{...props}
			>
				<header className="flex justify-between bg-neutral-300 text-xl dark:bg-neutral-700">
					{title && <h3>{title}</h3>}
					<Button
						variant="flat"
						className="text-neutral-900 mis-auto dark:text-neutral-50"
						onClick={() => closeDialog()}
					>
						<IoClose />
					</Button>
				</header>
				<section className="overflow-y-auto overflow-x-hidden bs-full min-bs-0 is-full em:pli-5 em:pbe-4">
					{children}
				</section>
			</dialog>
		)
	}
)

Dialog.displayName = 'Dialog'

export default Dialog
