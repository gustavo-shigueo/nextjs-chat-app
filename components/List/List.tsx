import {
	CSSProperties,
	DetailedHTMLProps,
	HTMLAttributes,
	ReactNode,
} from 'react'

type ItemKey<T> = {
	[R in keyof T]: T[R] extends string | number ? R : never
}[keyof T]

interface IListProps<ListItem>
	extends DetailedHTMLProps<
		HTMLAttributes<HTMLUListElement>,
		HTMLUListElement
	> {
	items: ListItem[]
	itemKey: ItemKey<ListItem>
	renderItem: (item: ListItem) => ReactNode
	listStyle?: CSSProperties['listStyle']
	style?: Omit<CSSProperties, 'listStyle'>
	liProps?: DetailedHTMLProps<HTMLAttributes<HTMLLIElement>, HTMLLIElement>
}

const List = <T,>({
	items,
	renderItem,
	listStyle,
	liProps,
	style,
	itemKey,
	...props
}: IListProps<T>) => (
	<ul style={{ ...style, listStyle }} {...props}>
		{items.map(i => (
			<li key={i[itemKey] as unknown as string | number} {...liProps}>
				{renderItem(i)}
			</li>
		))}
	</ul>
)

export default List
