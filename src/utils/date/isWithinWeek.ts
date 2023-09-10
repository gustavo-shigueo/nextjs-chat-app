export function isWithinWeek(date: Date) {
	const today = new Date()

	return (
		Math.abs(date.getDate() - today.getDate()) < 7 &&
		date.getMonth() === today.getMonth() &&
		date.getFullYear() === today.getFullYear()
	)
}
