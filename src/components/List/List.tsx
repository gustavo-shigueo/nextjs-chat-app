import {
	forwardRef,
	type CSSProperties,
	type DetailedHTMLProps,
	type HTMLAttributes,
	type ReactNode,
	type RefAttributes,
} from 'react'

type ItemKey<T> = {
	[R in keyof T]: T[R] extends string | number ? R : never
}[keyof T]

type ListProps<ListItem> = {
	items: ListItem[]
	itemKey: ItemKey<ListItem>
	renderItem: (item: ListItem, index: number, array: ListItem[]) => ReactNode
	listStyle?: CSSProperties['listStyle']
	style?: Omit<CSSProperties, 'listStyle'>
	liProps?: DetailedHTMLProps<HTMLAttributes<HTMLLIElement>, HTMLLIElement>
} & (
	| (({
			ordered?: false
	  } & Omit<
			DetailedHTMLProps<HTMLAttributes<HTMLUListElement>, HTMLUListElement>,
			'ref'
	  >) &
			RefAttributes<HTMLUListElement>)
	| ({
			ordered: true
			reversed?: boolean
			start?: number
	  } & Omit<
			DetailedHTMLProps<HTMLAttributes<HTMLOListElement>, HTMLOListElement>,
			'ref'
	  > &
			RefAttributes<HTMLOListElement>)
)

const List = forwardRef<HTMLOListElement | HTMLUListElement, ListProps<object>>(
	(
		{
			items,
			renderItem,
			listStyle,
			liProps,
			style,
			itemKey,
			ordered,
			...props
		},
		ref
	) => {
		const children = items.map((item, index, array) => (
			<li key={item[itemKey] as unknown as string | number} {...liProps}>
				{renderItem(item, index, array)}
			</li>
		))

		return ordered ? (
			<ol
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-ignore
				ref={ref}
				style={{ ...style, listStyle }}
				{...props}
			>
				{children}
			</ol>
		) : (
			<ul style={{ ...style, listStyle }} ref={ref} {...props}>
				{children}
			</ul>
		)
	}
)

List.displayName = 'List'

export default List as unknown as <T>(props: ListProps<T>) => JSX.Element
