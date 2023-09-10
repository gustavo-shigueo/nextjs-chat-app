export function formatDateTime(
	date: Date,
	locale?: string | string[] | undefined
) {
	const formatter = new Intl.DateTimeFormat(locale, {
		dateStyle: 'short',
		timeStyle: 'short',
	})

	return formatter.format(date)
}

export function formatDate(date: Date, locale?: string | string[] | undefined) {
	const formatter = new Intl.DateTimeFormat(locale, { dateStyle: 'short' })

	return formatter.format(date)
}

export function formatTime(date: Date, locale?: string | string[] | undefined) {
	const formatter = new Intl.DateTimeFormat(locale, { timeStyle: 'short' })

	return formatter.format(date)
}
