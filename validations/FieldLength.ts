import InvalidFieldError from 'errors/InvalidFieldError'
import IField from 'interfaces/IField'

/**
 * Verifies that the provided field has the appropriate length
 * @param field A field to be validated
 * @param minLength The minimum length for the field
 * @param maxLength The maximum length for the field
 * @throws {InvalidFieldError} If the field doesn't have the correct length, an error is throwns
 */
const FieldLength = (
	field: IField<string>,
	minLength: number,
	maxLength: number
) => {
	const [fieldName, { length }] = Object.entries(field).flat()

	if (length < minLength || length > maxLength) {
		throw new InvalidFieldError(
			`${fieldName} must be between ${minLength} and ${maxLength} characters long`,
			fieldName
		)
	}
}

export default FieldLength
