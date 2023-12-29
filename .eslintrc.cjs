/** @type {import("eslint").Linter.Config} */
module.exports = {
	overrides: [
		{
			extends: [
				'plugin:@typescript-eslint/recommended-requiring-type-checking',
			],
			files: ['*.ts', '*.tsx'],
			parserOptions: {
				project: 'tsconfig.json',
			},
		},
	],
	ignorePatterns: '*.spec.ts',
	parser: '@typescript-eslint/parser',
	parserOptions: {
		project: './tsconfig.json',
	},
	plugins: ['@typescript-eslint'],
	extends: ['next/core-web-vitals', 'plugin:@typescript-eslint/recommended'],
	rules: {
		'@typescript-eslint/consistent-type-imports': [
			'warn',
			{
				prefer: 'type-imports',
				fixStyle: 'inline-type-imports',
			},
		],
		'@typescript-eslint/no-extra-semi': 'off',
		'no-unused-vars': 'off',
		'@typescript-eslint/no-unused-vars': [
			'warn',
			{ vars: 'all', ignoreRestSiblings: true },
		],
		'@typescript-eslint/no-misused-promises': 'off',
	},
}
