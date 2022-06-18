type ClassName = { [k: string]: boolean }
const isString = (x: string | ClassName): x is string => typeof x === 'string'
const concat = (x: string, y: string) => `${x}${x && y && ' '}${y}`

const reducer = (acc: string, cur?: string | ClassName | null): string => {
	if (cur === null || cur === undefined) return acc

	if (isString(cur)) return concat(acc, cur)

	Object.entries(cur).forEach(([key, val]) => {
		if (val) acc = concat(acc, key)
	})

	return acc
}

export const classNames = (
	...args: (string | ClassName | null | undefined)[]
) => {
	return [...new Set(args.reduce(reducer, '').split(' '))].join(' ')
}
