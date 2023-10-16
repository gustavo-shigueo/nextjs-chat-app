import { twMerge } from 'tailwind-merge'
import styles from './Spinner.module.scss'

type SpinnerProps = {
	size?: number
	className?: string
}

export default function Spinner({ size = 2, className }: SpinnerProps) {
	return (
		<svg
			className={twMerge(
				'block fill-transparent stroke-neutral-500 bs-[min-content] max-is-[100%]',
				className
			)}
			style={{
				width: `${size}rem`,
				height: `${size}rem`,
				strokeWidth: size * 2,
			}}
		>
			<circle
				strokeLinecap="square"
				className={twMerge('aspect-square origin-center', styles.spinner)}
				r={size * 8 - 4}
				cx={size * 8}
				cy={size * 8}
				pathLength="100"
			/>
		</svg>
	)
}
