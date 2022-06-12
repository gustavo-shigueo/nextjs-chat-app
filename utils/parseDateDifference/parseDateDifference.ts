import dateFormatter from 'utils/formatters/date'
import timeFormatter from 'utils/formatters/time'

const isToday = (date: Date, today: Date): boolean => {
	return (
		today.getDate() === date.getDate() &&
		today.getMonth() === date.getMonth() &&
		today.getFullYear() === date.getFullYear()
	)
}

const isYesterday = (date: Date, today: Date): boolean => {
	return (
		today.getDate() === date.getDate() + 1 &&
		today.getMonth() === date.getMonth() &&
		today.getFullYear() === date.getFullYear()
	)
}

const parseDateDifference = (date: Date): string => {
	const now = Date.now()
	const today = new Date(now)

	if (isToday(date, today)) return timeFormatter.format(date)

	if (isYesterday(date, today)) return 'Ontem'

	return dateFormatter.format(date)
}

export default parseDateDifference
