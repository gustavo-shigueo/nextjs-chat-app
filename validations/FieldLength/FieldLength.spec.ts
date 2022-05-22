import InvalidFieldError from 'errors/InvalidFieldError'
import FieldLength from './FieldLength'

describe('Field length validation', () => {
	it('Can detect a short field', () => {
		const test = () => FieldLength({ field: 'a' }, 5, Number.MAX_SAFE_INTEGER)

		expect(test).toThrowError(
			new InvalidFieldError(
				`field must be between 5 and ${Number.MAX_SAFE_INTEGER} characters long`,
				['field']
			)
		)
	})

	it('Can detect a long field', () => {
		const test = () => FieldLength({ field: 'a'.repeat(10) }, 0, 3)

		expect(test).toThrowError(
			new InvalidFieldError('field must be between 0 and 3 characters long', [
				'field',
			])
		)
	})

	it("Won't throw on a valid field", () => {
		const test = () => FieldLength({ field: 'a'.repeat(10) }, 5, 20)

		expect(test).not.toThrowError()
	})
})
