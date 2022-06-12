import { DetailedHTMLProps, HTMLAttributes, ReactNode } from 'react'

interface IListProps<ListItem>
	extends DetailedHTMLProps<
		HTMLAttributes<HTMLUListElement>,
		HTMLUListElement
	> {
	items: ListItem[]
	render: (item: ListItem) => ReactNode
}

const List = <T extends { id: number | string }>({
	items,
	render,
	...props
}: IListProps<T>) => {
	return (
		<ul {...props}>
			{items.map(i => (
				<li key={i.id}>{render(i)}</li>
			))}
		</ul>
	)
}

export default List
