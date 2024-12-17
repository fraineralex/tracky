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
			dynamic: 300,
			static: 900
		}
	}
}

export default config
