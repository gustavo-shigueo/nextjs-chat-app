import EmptyFieldError from 'errors/EmptyFieldError'
import EmptyFields from './EmptyFields'

describe('Empty fields validation', () => {
	it('Can detect an empty property in an object', () => {
		const test = () => EmptyFields({ field: '' })
		expect(test).toThrowError()
	})

	it('Can detect a property with only whitespaces in an object with valid properties', () => {
		const test = () => EmptyFields({ field: '  ' })

		expect(test).toThrowError(new EmptyFieldError(['field']))
	})

	it('Can detect a property with only whitespaces in an object with valid properties', () => {
		const test = () => EmptyFields({ a: 'a', field: '  ', c: 2 })
		expect(test).toThrowError(new EmptyFieldError(['field']))
	})

	it('Can detect an empty property in an object with valid properties', () => {
		const test = () => EmptyFields({ a: 'a', field: '', c: 'f' })
		expect(test).toThrowError(new EmptyFieldError(['field']))
	})

	it('Can detect a null property in an object', () => {
		const test = () => EmptyFields({ field: null })
		expect(test).toThrowError(new EmptyFieldError(['field']))
	})

	it('Can detect a null property in an object with valid properties', () => {
		const test = () => EmptyFields({ a: 'a', field: null, c: 'f' })
		expect(test).toThrowError(new EmptyFieldError(['field']))
	})

	it("Won't throw on a valid fieldset", () => {
		const test = () => {
			EmptyFields({ field: 'test', another: 'testing', number: 2 })
		}

		expect(test).not.toThrowError()
	})
})
