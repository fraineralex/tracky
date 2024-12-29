import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
	return {
		name: 'tracky',
		short_name: 'tracky',
		description:
			'Fitness tracking web app with AI-powered features to quickly log meals and exercises.',
		start_url: '/',
		display: 'standalone',
		background_color: '#F0F9F3',
		theme_color: '#16A34A',
		icons: [
			{
				src: '/favicon.ico',
				sizes: 'any',
				type: 'image/x-icon'
			}
		]
	}
}
