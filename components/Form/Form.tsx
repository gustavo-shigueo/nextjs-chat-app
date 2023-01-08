import { FC, FormHTMLAttributes } from 'react'
import classNames from 'utils/classNames'
import styles from './Form.module.scss'

interface FormProps extends FormHTMLAttributes<HTMLFormElement> {
	handleFormData?: (data: any) => any
}

const Form: FC<FormProps> = ({ children, className, onSubmit }) => (
	<form onSubmit={onSubmit} className={classNames(styles.form, className)}>
		{children}
	</form>
)

export default Form
