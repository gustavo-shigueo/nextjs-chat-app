export function getWeekDay(date: Date, locale?: string | string[] | undefined) {
	const formatter = new Intl.DateTimeFormat(locale, {
		weekday: 'long',
	})

	return formatter.format(date)
}
