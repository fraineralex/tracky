import { env } from '~/env'

export default function robots() {
	const DOMAIN = env.DOMAIN
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
