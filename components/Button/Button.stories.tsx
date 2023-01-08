/* eslint-disable */
import { ComponentStory, ComponentMeta } from '@storybook/react'
import Button, { ButtonProps } from './Button'
import Spinner from '_components/Spinner'

type TemplateProps = ButtonProps & { darkTheme: boolean }

const Template = ({ children: label, darkTheme, ...args }: TemplateProps) => (
	<div className={darkTheme ? 'dark' : 'light'}>
		<Button {...args}>{label ?? 'Click me!'}</Button>
	</div>
)

export const ButtonComponent: ComponentStory<typeof Template> = Template.bind(
	{}
)
ButtonComponent.args = {
	children: 'Click me',
	loading: false,
	variant: 'primary',
	onClick: console.log,
	darkTheme: true,
	outline: false,
	disabled: false,
}

export default {
	title: 'Button',
	component: Button,
	subcomponents: {
		Spinner,
	},
	argTypes: {},
	args: {
		loading: false,
		spinner: () => <Spinner />,
	},
} as ComponentMeta<typeof Button>
