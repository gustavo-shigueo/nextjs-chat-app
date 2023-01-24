import dateFormatter from 'utils/formatters/date'
import timeFormatter from 'utils/formatters/time'

export const isToday = (date: Date): boolean => {
	const now = Date.now()
	const today = new Date(now)

	return (
		today.getDate() === date.getDate() &&
		today.getMonth() === date.getMonth() &&
		today.getFullYear() === date.getFullYear()
	)
}

export const isYesterday = (date: Date): boolean => {
	const now = Date.now()
	const today = new Date(now)

	return (
		today.getDate() === date.getDate() + 1 &&
		today.getMonth() === date.getMonth() &&
		today.getFullYear() === date.getFullYear()
	)
}

const parseDateDifference = (date: Date): string => {
	if (isToday(date)) return timeFormatter.format(date)

	if (isYesterday(date)) return 'Ontem'

	return dateFormatter.format(date)
}

export default parseDateDifference
