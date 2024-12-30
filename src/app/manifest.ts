import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
	return {
		name: 'tracky',
		short_name: 'tracky',
		description:
			'Fitness tracking web app with AI-powered features to quickly log meals and exercises.',
		start_url: '/',
		display: 'standalone',
		icons: [
			{
				src: '/favicon.ico',
				sizes: '24x24',
				type: 'image/x-icon'
			}
		]
	}
}
