export function formatRelativeDate(
	value: number,
	unit: Intl.RelativeTimeFormatUnit,
	locale?: string | string[] | undefined
) {
	const formatter = new Intl.RelativeTimeFormat(locale, {
		numeric: 'auto',
		style: 'short',
	})

	return formatter.format(value, unit)
}
