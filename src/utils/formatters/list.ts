export function formatList(
	value: string[],
	locale?: string | string[] | undefined
) {
	const formatter = new Intl.ListFormat(locale, {
		type: 'conjunction',
	})

	return formatter.format(value)
}
