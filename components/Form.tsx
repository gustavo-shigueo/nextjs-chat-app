import { FC, FormEvent, FormHTMLAttributes } from 'react'

interface FormProps extends FormHTMLAttributes<HTMLFormElement> {
	handleFormData?: (data: any) => any
}

const Form: FC<FormProps> = ({
	children,
	className,
	handleFormData = _ => {},
}) => {
	const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault()

		const formData = new FormData(e.target as HTMLFormElement)
		const dataArr = [...formData.entries()]

		const data = dataArr.reduce(
			(acc, [name, value]) => ({ ...acc, [name]: value }),
			{}
		)

		handleFormData(data)
	}

	return (
		<form onSubmit={handleSubmit} className={`form ${className ?? ''}`}>
			{children}
		</form>
	)
}

export default Form
