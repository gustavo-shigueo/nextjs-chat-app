/* eslint-disable */
import Input, { InputProps } from './Input'

export default {
	title: 'Input',
}

export const Default = ({
	darkMode,
	...args
}: InputProps<any> & { darkMode: boolean }) => (
	<div className={darkMode ? 'dark' : 'light'}>
		<Input {...args} />
	</div>
)

Default.args = {
	name: 'default',
	label: 'Label:',
	pattern: '',
	minlength: 1,
	darkMode: true,
	invalid: false,
	required: true,
}
