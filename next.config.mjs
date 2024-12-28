/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import('./src/env.js')

/** @type {import("next").NextConfig} */
const config = {
	experimental: {
		ppr: 'incremental',
		dynamicIO: true,
		staleTimes: {
			dynamic: 1440, // 24 hours
			static: 43200 // 30 days
		}
	},
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'pub-f159aa4256dd4a64ae2f0c18d87e674e.r2.dev',
				port: '',
				pathname: '/**',
				search: ''
			}
		]
	}
}

export default config
