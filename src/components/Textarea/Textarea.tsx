import {
	forwardRef,
	useId,
	useState,
	type CSSProperties,
	type TextareaHTMLAttributes,
} from 'react'
import { twMerge } from 'tailwind-merge'
import styles from './Textarea.module.scss'

type TextareaProps = Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'id'> & {
	name: string
	error?: string
	maxLines?: number
	resize?: CSSProperties['resize']
} & (
		| { label: string }
		| { placeholder: string }
		| { label: string; placeholder: string }
	)

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
	(
		{
			className,
			name,
			error,
			onChange,
			maxLines,
			resize = 'none',
			style,
			...props
		},
		ref
	) => {
		const id = useId()
		const [dirty, setDirty] = useState(false)

		const handler: typeof onChange = e => {
			if (e.target.parentElement) {
				e.target.parentElement.dataset.value = e.target.value
			}

			setDirty(true)
			onChange?.(e)
		}

		return (
			<div
				className={twMerge(
					// General Styling
					'relative isolate grid text-[var(--text-color)] text-neutral-800 outline-offset-[3px] outline-[var(--text-color)] em:gap-1 dark:text-neutral-300',

					// ::after
					'after:invisible after:-z-10 after:whitespace-pre-wrap after:break-all after:rounded after:border-2 after:text-transparent after:opacity-[0.075] after:content-[attr(data-value)_"_"] after:max-is-[100%] after:plb-2 after:pli-3 after:[font:_inherit] after:[grid-column:_1_/_-1] after:[word-wrap:_break-word]',

					// Colors, block-size calculation and grid-row logic
					// Most of these could be tailwind classes, but they
					// would be very hard to read due to the selectors
					styles['wrapper']
				)}
				style={
					{ '--max-lines': maxLines ?? 1 } as CSSProperties & {
						'--max-lines': number
					}
				}
			>
				{'label' in props && (
					<label htmlFor={`${id}-${name}`}>{props.label}</label>
				)}
				<textarea
					className={twMerge(
						'break-all rounded shadow max-is-[100%] plb-2 pli-3 [grid-column:_1_/_-1] [word-wrap:_break-word] placeholder:text-inherit',

						className
					)}
					rows={1}
					ref={ref}
					name={name}
					aria-invalid={!!error}
					onChange={handler}
					style={{ ...style, resize }}
					{...props}
				/>
				{error && dirty && (
					<p className={twMerge('em:text-xs em:mbs-1', styles['error'])}>
						{error}
					</p>
				)}
			</div>
		)
	}
)

Textarea.displayName = 'Textarea'

export default Textarea
