import { type InputHTMLAttributes, type ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'

type CheckBoxProps = Omit<
	InputHTMLAttributes<HTMLInputElement>,
	'type' | 'name' | 'id' | 'value'
> & {
	children: ReactNode
	name: string
}

export default function CheckBox({
	children,
	className,
	...props
}: CheckBoxProps) {
	return (
		<label
			className={twMerge(
				'relative flex cursor-pointer items-center gap-2 rounded transition-colors focus-within:bg-neutral-50/25 hover:bg-neutral-50/25 em:p-2',
				className
			)}
		>
			<input className="rounded text-violet-600" type="checkbox" {...props} />
			{children}
		</label>
	)
}
