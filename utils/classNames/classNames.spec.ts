import { classNames } from './classNames'

describe('classNames utility', () => {
	it('can concatenate string classnames with spaces', () => {
		const result = classNames('foo', 'bar', 'baz')
		expect(result).toBe('foo bar baz')
	})

	it('can conditionally add classes from an object with boolean values', () => {
		const classes = {
			foo: true,
			bar: false,
			baz: true,
		}

		const result = classNames(classes)

		expect(result).toBe('foo baz')
	})

	it('can conditionally add classes from multiple objects with boolean values', () => {
		const classes1 = { foo: true, bar: false }
		const classes2 = { baz: false, boo: true }

		const result = classNames(classes1, classes2)

		expect(result).toBe('foo boo')
	})

	it('can combine classes from strings and an object', () => {
		const classes = { bar: true, baz: true }
		const result = classNames('boo', classes, 'foo')

		expect(result).toBe('boo bar baz foo')
	})

	it('can combine classes from strings and objects', () => {
		const classes1 = { bar: false, baz: true }
		const classes2 = { boo: true, foo: true }
		const result = classNames('dar', classes1, 'daz', classes2)

		expect(result).toBe('dar baz daz boo foo')
	})

	it('can filter out duplicate classes', () => {
		const result = classNames('foo bar', { bar: true }, 'foo', { baz: true })
		expect(result).toBe('foo bar baz')
	})

	it('can filter out null and undefined', () => {
		const result = classNames('foo', null, 'bar', undefined)
		expect(result).toBe('foo bar')
	})
})
