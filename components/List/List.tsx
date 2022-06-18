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

const List = <T extends { id: number | string }>({
	items,
	render,
	listStyle,
	liProps,
	...props
}: IListProps<T>) => {
	return (
		<ul style={{ listStyle }} {...props}>
			{items.map(i => (
				<li key={i.id} {...liProps}>
					{render(i)}
				</li>
			))}
		</ul>
	)
}

export default List
