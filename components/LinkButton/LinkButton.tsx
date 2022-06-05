import { FC } from 'react'
import { useRouter } from 'next/router'
import Button from 'components/Button'
import { ButtonProps } from 'components/Button/Button'

interface LinkButtonProps extends ButtonProps {
	href: string
	shallow?: boolean
}

const LinkButton: FC<LinkButtonProps> = ({
	href,
	children,
	shallow = false,
	...props
}) => {
	const router = useRouter()

	const clickHandler = () => {
		router.push(href ?? '', undefined, { shallow })
	}

	return (
		<Button onClick={clickHandler} {...props}>
			{children}
		</Button>
	)
}

export default LinkButton
