import EmptyFieldError from 'errors/EmptyFieldError'
import IField from 'validations/IField'

/**
 * @param value Value to test
 * @returns Whether the value is a string
 */
const isString = (value: any): value is string => typeof value === 'string'

/**
 * Ensures all required fields are not null or a string that is
 * empty or contains only white spaces
 * @param {IField<any>} fields
 * @throws {EmptyFieldError} If an empty field is found, an error is thrown
 */
const EmptyFields = (fields: IField<any>): void => {
	Object.entries(fields).forEach(([fieldName, value]) => {
		if (isString(value) && value.trim() !== '') return
		if (!isString(value) && value != null) return

		throw new EmptyFieldError([fieldName])
	})
}

export default EmptyFields
