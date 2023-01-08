/* eslint-disable */
import Spinner, { SpinnerProps } from './Spinner'

export default {
	title: 'Spinner',
}

export const Default = (args: SpinnerProps) => <Spinner {...args} />

Default.args = {
	size: 1,
}
