// Adding inert attribute to global html attributes.
// When react properly implements this prop, this file can be deleted
// and all uses of inert should be converted from 'true' | undefined
// to boolean | undefined
declare namespace React {
	interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
		inert?: 'true' | undefined
	}

	interface CSSProperties extends CSS.Properties<string | number> {
		[key: `--${string}`]: string | number
	}
}
