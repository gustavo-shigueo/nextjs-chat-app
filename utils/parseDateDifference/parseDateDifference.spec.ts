import parseDateDifference from './parseDateDifference'

describe('parseDate utility', () => {
	let today: Date

	beforeEach(() => {
		today = new Date(2022, 5, 12, 15, 0)
		Date.now = jest.fn(() => today.valueOf())
	})

	it('should return the time as hh:mm if the time is today', () => {
		const time = new Date(2022, 5, 12, 14, 30)

		expect(parseDateDifference(time)).toBe('14:30')
	})

	it("should return the locale apprpriate word for 'Yesterday' if the time is in the previous day", () => {
		const time = new Date(2022, 5, 11, 13, 0)

		expect(parseDateDifference(time)).toBe('Ontem')
	})

	it('should return the date formatted according to the locale for longer periods of time', () => {
		const time = new Date(2022, 5, 10, 13, 0)

		expect(parseDateDifference(time)).toBe('10/06/2022')
	})
})
