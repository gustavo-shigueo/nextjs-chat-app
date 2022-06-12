/** @type {import('next').NextConfig} */
module.exports = {
	reactStrictMode: true,
	images: {
		domains: ['lh3.googleusercontent.com', 'avatars.dicebear.com'],
	},
	i18n: {
		localeDetection: true,
		locales: ['pt-br'],
		defaultLocale: 'pt-br',
	},
}
