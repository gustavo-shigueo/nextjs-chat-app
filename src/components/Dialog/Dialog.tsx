import { forwardRef, useRef, type DialogHTMLAttributes, useEffect } from 'react'
import { IoClose } from 'react-icons/io5'
import { twMerge } from 'tailwind-merge'
import Button from '../Button'

type DialogProps = DialogHTMLAttributes<HTMLDialogElement>

const Dialog = forwardRef<HTMLDialogElement, DialogProps>(
	({ children, className, title, ...props }, ref) => {
		const localRef = useRef<HTMLDialogElement | null>(null)

		useEffect(() => {
			if (!localRef.current) return

			const observer = new MutationObserver(entries => {
				const [entry] = entries
				const target = entry?.target as HTMLDialogElement | undefined

				if (!target) return

				if (target.hasAttribute('open')) {
					target.removeAttribute('inert')
				} else {
					target.setAttribute('inert', '')
				}
			})

			observer.observe(localRef.current, {
				attributes: true,
				attributeFilter: ['open'],
				subtree: false,
				attributeOldValue: false,
				characterData: false,
				characterDataOldValue: false,
				childList: false,
			})

			return () => observer.disconnect()
		}, [])

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

		return (
			<dialog
				className={twMerge(
					'fixed m-0 translate-x-[-50%] translate-y-[-100%] overflow-hidden rounded-lg border-none bg-neutral-100 p-0 text-inherit min-bs-0 max-bs-[90svb] is-[min(90svi,_50em)] max-is-[50ch] block-start-0 inline-start-[50%] backdrop:bg-neutral-900 backdrop:opacity-0 backdrop:transition-opacity open:translate-y-[-50%] open:block-start-[50%] open:backdrop:opacity-75 motion-safe:transition-[inset-block-start,_transform] dark:bg-neutral-800',
					className
				)}
				ref={node => {
					localRef.current = node

					if (typeof ref === 'function') ref(node)
					else if (ref) ref.current = node
				}}
				inert={'true'}
				{...props}
			>
				<header className="flex justify-between bg-neutral-300 text-xl dark:bg-neutral-700">
					{title && <h3>{title}</h3>}
					<Button
						variant="flat"
						className="text-neutral-900 mis-auto dark:text-neutral-50"
						onClick={() => closeDialog()}
						aria-label="Fechar"
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
