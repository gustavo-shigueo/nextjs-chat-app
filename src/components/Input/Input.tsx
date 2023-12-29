import {
	forwardRef,
	useId,
	useState,
	type HTMLInputTypeAttribute,
	type InputHTMLAttributes,
	type ReactNode,
} from 'react'
import { twMerge } from 'tailwind-merge'
import styles from './Input.module.scss'

type Label =
	| { label: string; placeholder: string }
	| { placeholder: string }
	| { label: string }

type InputProps = Omit<
	InputHTMLAttributes<HTMLInputElement>,
	'type' | 'name' | 'id'
> &
	Label & {
		name: string
		type: HTMLInputTypeAttribute
		error?: string
		leftIcon?: ReactNode
		rightIcon?: ReactNode
	}

const Input = forwardRef<HTMLInputElement, InputProps>(
	({ name, error, className, onBlur, leftIcon, rightIcon, ...props }, ref) => {
		const id = useId()
		const [dirty, setDirty] = useState(false)

		return (
			<div
				className={twMerge(
					// General Styling
					'relative isolate grid text-[var(--text-color)] outline-offset-[3px] outline-[var(--text-color)] is-[100%] em:gap-1',

					// Color logic
					styles['wrapper']
				)}
			>
				{'label' in props && (
					<label htmlFor={`${id}-${name}`} className="text-lg font-bold">
						{props.label}:
					</label>
				)}
				<span className="flex gap-0">
					{leftIcon}
					<input
						id={`${id}-${name}`}
						className={twMerge(
							'rounded border-2 shadow is-[100%] placeholder:text-inherit focus:ring-inset',
							className
						)}
						name={name}
						aria-invalid={!!error}
						ref={ref}
						onBlur={e => {
							setDirty(true)
							onBlur?.(e)
						}}
						{...props}
					/>
					{rightIcon}
				</span>
				{error && dirty && (
					<p className={twMerge('em:text-xs em:mbs-1', styles['error'])}>
						{error}
					</p>
				)}
			</div>
		)
	}
)

Input.displayName = 'Input'

export default Input
