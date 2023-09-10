export function isTomorrow(date: Date) {
	const today = new Date()

	return (
		date.getDate() === today.getDate() + 1 &&
		date.getMonth() === today.getMonth() &&
		date.getFullYear() === today.getFullYear()
	)
}
