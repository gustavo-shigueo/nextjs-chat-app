import { cva } from 'class-variance-authority'
import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'
import Spinner from '../Spinner/Spinner'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
	loading?: boolean
	outline?: boolean
	rightIcon?: ReactNode
	leftIcon?: ReactNode
	variant?:
		| 'primary'
		| 'accent'
		| 'neutral'
		| 'danger'
		| 'warning'
		| 'success'
		| 'flat'
		| 'none'
}

const classes = cva(
	[
		'group relative isolate inline-grid cursor-pointer grid-cols-[auto_1fr_auto] items-center overflow-hidden border-[1px] border-solid font-bold text-neutral-50 shadow outline-2 outline-offset-[-2px] transition-[outline-offset] focus-visible:outline focus-visible:outline-offset-1 disabled:pointer-events-none data-[loading=true]:text-transparent em:rounded em:p-2',

		'after:absolute after:inset-[-1px] after:-z-10 after:rounded-[inherit] after:bg-neutral-50/0 after:transition-colors after:content-[""] enabled:after:pointer-events-none enabled:hover:after:bg-neutral-50/25 enabled:focus-visible:after:bg-neutral-50/25 disabled:after:z-20 disabled:after:bg-neutral-600/50',
	],
	{
		variants: {
			variant: {
				primary: [
					'bg-sky-600',
					'dark:bg-sky-500',
					'border-sky-600',
					'dark:border-sky-500',
					'focus-visible:outline-sky-600',
					'dark:focus-visible:outline-sky-500',
				],
				accent: [
					'bg-violet-600',
					'dark:bg-violet-500',
					'border-violet-600',
					'dark:border-violet-500',
					'focus-visible:outline-violet-600',
					'dark:focus-visible:outline-violet-500',
				],
				danger: [
					'bg-red-600',
					'dark:bg-red-500',
					'border-red-600',
					'dark:border-red-500',
					'focus-visible:outline-red-600',
					'dark:focus-visible:outline-red-500',
				],
				warning: [
					'bg-yellow-600',
					'dark:bg-yellow-600',
					'border-yellow-600',
					'dark:border-yellow-600',
					'focus-visible:outline-yellow-600',
					'dark:focus-visible:outline-yellow-600',
				],
				success: [
					'bg-green-600',
					'dark:bg-green-600',
					'border-green-600',
					'dark:border-green-600',
					'focus-visible:outline-green-600',
					'dark:focus-visible:outline-green-600',
				],
				neutral: [
					'bg-neutral-600',
					'border-neutral-600',
					'focus-visible:outline-neutral-600',
				],
				flat: [
					'bg-transparent',
					'border-transparent',
					'outline-neutral-50/25',
					'text-inherit',
				],
				'outline-primary': [
					'bg-transparent',
					'text-sky-600',
					'dark:text-sky-500',
					'border-sky-600',
					'dark:border-sky-500',
					'focus-visible:outline-sky-600',
					'dark:focus-visible:outline-sky-500',
				],
				'outline-accent': [
					'bg-transparent',
					'text-violet-600',
					'dark:text-violet-500',
					'border-violet-600',
					'dark:border-violet-500',
					'focus-visible:outline-violet-600',
					'dark:focus-visible:outline-violet-500',
				],
				none: undefined,
				'outline-danger': [
					'bg-transparent',
					'text-red-600',
					'dark:text-red-500',
					'border-red-600',
					'dark:border-red-500',
					'focus-visible:outline-red-600',
					'dark:focus-visible:outline-red-500',
				],
				'outline-warning': [
					'bg-transparent',
					'text-yellow-600',
					'dark:text-yellow-600',
					'border-yellow-600',
					'dark:border-yellow-600',
					'focus-visible:outline-yellow-600',
					'dark:focus-visible:outline-yellow-600',
				],
				'outline-success': [
					'bg-transparent',
					'text-green-600',
					'dark:text-green-600',
					'border-green-600',
					'dark:border-green-600',
					'focus-visible:outline-green-600',
					'dark:focus-visible:outline-green-600',
				],
				'outline-neutral': [
					'bg-transparent',
					'text-neutral-600',
					'border-neutral-600',
					'focus-visible:outline-neutral-600',
				],
				'outline-flat': [
					'bg-transparent',
					'border-transparent',
					'text-inherit',
				],
				'outline-none': undefined,
			},
		},
	}
)

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
	(
		{
			type = 'button',
			variant = 'primary',
			onClick,
			children,
			loading = false,
			leftIcon,
			rightIcon,
			disabled,
			className,
			outline,
			...props
		},
		ref
	) => (
		<button
			className={twMerge(
				classes({ variant: `${outline ? 'outline-' : ''}${variant}` }),
				className
			)}
			type={type}
			data-variant={variant}
			data-outline={outline}
			data-loading={loading}
			disabled={loading || disabled}
			onClick={onClick}
			ref={ref}
			{...props}
		>
			{leftIcon && (
				<span className="icon flex aspect-square place-content-start items-center self-stretch justify-self-start mie-4 [grid-column:_1] group-data-[loading-true]:invisible">
					{leftIcon}
				</span>
			)}
			<div className="flex place-content-center items-center gap-4 is-full [grid-column:_2] group-data-[loading=true]:invisible">
				{children}
			</div>
			{rightIcon && (
				<span className="icon flex aspect-square place-content-end items-center self-stretch justify-self-end mis-4 [grid-column:_3] group-data-[loading-true]:invisible">
					{rightIcon}
				</span>
			)}
			{loading && (
				<div className="absolute inset-0 -z-20 grid place-items-center">
					<Spinner />
				</div>
			)}
		</button>
	)
)

Button.displayName = 'Button'

export default Button
