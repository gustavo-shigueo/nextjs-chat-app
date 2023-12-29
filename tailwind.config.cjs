const plugin = require('tailwindcss/plugin')

/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{js,ts,jsx,tsx}'],
	darkMode: 'class',
	theme: {
		extend: {
			primary: [],
		},
	},
	plugins: [
		require('tailwindcss-logical'),
		require('@tailwindcss/forms'),
		require('@tailwindcss/container-queries'),
		plugin(({ addVariant }) => {
			addVariant('em', ({ container }) => {
				container.walkRules(rule => {
					rule.selector = `.em\\:${rule.selector.slice(1)}`
					rule.walkDecls(decl => {
						decl.value = decl.value.replace('rem', 'em')
					})
				})
			})
		}),
		plugin(({ matchVariant }) => {
			matchVariant('supports', value => `@supports(${value})`)
		}),
		plugin(({ addBase, theme }) => {
			function extractColorVars(colorObj, colorGroup = '') {
				return Object.keys(colorObj).reduce((vars, colorKey) => {
					const value = colorObj[colorKey]

					if (typeof value !== 'string') {
						return { ...vars, ...extractColorVars(value, `-${colorKey}`) }
					}

					const key = `--color${colorGroup}-${colorKey}`

					if (!/^#.{6}$/.test(value)) {
						return { ...vars, [key]: value }
					}

					const color = value
						.match(/(?<=#.*).{2}/g)
						.map(byte => parseInt(byte, 16))
						.join(' ')

					return { ...vars, [key]: `rgb(${color} / var(--color-opacity, 1))` }
				}, {})
			}

			addBase({
				':root': extractColorVars(theme('colors')),
			})
		}),
	],
}
