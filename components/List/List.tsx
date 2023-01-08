import { DetailedHTMLProps, HTMLAttributes, ReactNode } from 'react'

interface IListProps<ListItem>
	extends DetailedHTMLProps<
		HTMLAttributes<HTMLUListElement>,
		HTMLUListElement
	> {
	items: ListItem[]
	render: (item: ListItem) => ReactNode
	listStyle?:
		| '-moz-initial'
		| 'inherit'
		| 'initial'
		| 'inside'
		| 'none'
		| 'outside'
		| 'revert'
		| 'unset'
		| undefined
	liProps?: DetailedHTMLProps<HTMLAttributes<HTMLLIElement>, HTMLLIElement>
}

const List = <T extends { key: number | string }>({
	items,
	render,
	listStyle,
	liProps,
	style,
	...props
}: IListProps<T>) => {
	return (
		<ul style={{ ...style, listStyle }} {...props}>
			{items.map(i => (
				<li key={i.key} {...liProps}>
					{render(i)}
				</li>
			))}
		</ul>
	)
}

export default List
