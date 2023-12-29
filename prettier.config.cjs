/** @type {import("prettier").Config} */
module.exports = {
	plugins: [require.resolve('prettier-plugin-tailwindcss')],
	semi: false,
	useTabs: true,
	tabWidth: 2,
	arrowParens: 'avoid',
	singleQuote: true,
}
