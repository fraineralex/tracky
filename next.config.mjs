/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import('./src/env.js')

/** @type {import("next").NextConfig} */
const config = {
	experimental: {
		reactCompiler: true,
		ppr: 'incremental',
		dynamicIO: true,
		staleTimes: {
			dynamic: 1440, // 12 hours
			static: 43200 // 15 days
		}
	},
	images: {
		minimumCacheTTL: 31536000, // 1 year
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
