export default function robots() {
	const DOMAIN = process.env.DOMAIN || 'https://tracky.fit'
	return {
		rules: [
			{
				userAgent: '*',
				allow: ['/']
			}
		],
		sitemap: `${DOMAIN}/sitemap.xml`,
		host: DOMAIN
	}
}
