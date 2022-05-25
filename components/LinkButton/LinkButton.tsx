import { AnchorHTMLAttributes, FC } from 'react'
import style from 'components/Button/Button.module.scss'
import classNames from 'utils/classNames'
import { useRouter } from 'next/router'

interface LinkButtonProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
	loading?: boolean
	shallow?: boolean
	spinner?: () => JSX.Element
	variant?:
		| 'primary'
		| 'accent'
		| 'neutral'
		| 'outline-primary'
		| 'outline-accent'
		| 'outline-neutral'
		| 'danger'
		| 'warning'
		| 'success'
}

const LinkButton: FC<LinkButtonProps> = ({
	href,
	children,
	className,
	variant,
	shallow = false,
	...props
}) => {
	const router = useRouter()

	const clickHandler = (e: any) => {
		e.preventDefault()
		router.push(href ?? '', undefined, { shallow })
	}

	return (
		<a
			onClick={clickHandler}
			href={'#!'}
			className={classNames(
				'box-shadow-small',
				'border-radius-100',
				className,
				style.btn,
				style[`btn-${variant}`]
			)}
			{...props}
		>
			{children}
		</a>
	)
}

export default LinkButton
