const config = {
	stories: [
		'../components/**/*.stories.mdx',
		'../components/**/*.stories.@(js|jsx|ts|tsx)',
	],
	addons: [
		'@storybook/addon-links',
		'@storybook/addon-essentials',
		'@storybook/addon-interactions',
		'storybook-addon-next',
		'storybook-dark-mode',
	],
	framework: '@storybook/react',
	core: {
		builder: '@storybook/builder-webpack5',
		disableTelemetry: true,
	},
}

module.exports = config
