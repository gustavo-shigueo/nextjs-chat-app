import { FC, HTMLAttributes } from 'react'
import styles from './Spinner.module.scss'

export interface SpinnerProps extends HTMLAttributes<HTMLDivElement> {
	size?: number
}

const Spinner: FC<SpinnerProps> = ({
	size = 1,
	style: HTMLStyle,
	...props
}) => (
	<div
		className={styles.spinner}
		style={{ width: `${size}rem`, ...HTMLStyle }}
		{...props}
	/>
)

export default Spinner
