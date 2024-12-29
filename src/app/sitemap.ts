import { MetadataRoute } from 'next'

export default function sitemap() {
	const DOMAIN = process.env.DOMAIN || 'https://tracky.fit'

	const routes: MetadataRoute.Sitemap = [
		{
			url: `${DOMAIN}/`,
			lastModified: new Date(),
			changeFrequency: 'yearly',
			priority: 1,
			images: [
				'https://pub-f159aa4256dd4a64ae2f0c18d87e674e.r2.dev/og.webp',
				'https://pub-f159aa4256dd4a64ae2f0c18d87e674e.r2.dev/gh.webp',
				'https://pub-f159aa4256dd4a64ae2f0c18d87e674e.r2.dev/log.webp'
			]
		},
		{
			url: `${DOMAIN}/dashboard`,
			lastModified: new Date(),
			changeFrequency: 'daily',
			priority: 1
		},
		{
			url: `${DOMAIN}/food`,
			lastModified: new Date(),
			changeFrequency: 'daily',
			priority: 1
		},
		{
			url: `${DOMAIN}/exercise`,
			lastModified: new Date(),
			changeFrequency: 'daily',
			priority: 1
		},
		{
			url: `${DOMAIN}/diary`,
			lastModified: new Date(),
			changeFrequency: 'daily',
			priority: 1
		},
		{
			url: `${DOMAIN}/settings`,
			lastModified: new Date(),
			changeFrequency: 'monthly',
			priority: 1
		}
	]

	return routes
}
