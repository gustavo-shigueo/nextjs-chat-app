import { Head, Html, Main, NextScript } from 'next/document'

export default function Document() {
	return (
		<Html>
			<Head />
			<body className="bg-neutral-50 text-neutral-900 transition-colors dark:bg-neutral-800 dark:text-neutral-50 [&_>_:first-child]:grid [&_>_:first-child]:grid-rows-[auto_1fr]">
				<Main />
				<div id="portal" />
				<NextScript />
			</body>
		</Html>
	)
}
