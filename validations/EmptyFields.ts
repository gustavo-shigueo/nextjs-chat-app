interface Fields {
	[key: string]: any
}

interface EmptyFieldError {
	name: string
	fieldName: string
	message: string
}

const isString = (value: any): value is string => typeof value === 'string'

const EmptyFields = (fields: Fields): [boolean, EmptyFieldError[]] => {
	const errors: EmptyFieldError[] = []
	let hasError = false

	Object.entries(fields).forEach(([fieldName, value]) => {
		if (isString(value) && value.trim() !== '') return
		if (!isString(value) && value != null) return

		hasError = true
		errors.push({
			name: 'RequiredFieldWasNotProvided',
			fieldName,
			message: `Field ${fieldName} cannot be blank`,
		})
	})

	return [hasError, errors]
}

export default EmptyFields
