import path from 'path'
import { fileURLToPath } from 'url'
import { defineConfig } from 'vitest/config'

const rootDir = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
	test: {
		environment: 'node',
		include: ['src/**/*.test.ts']
	},
	resolve: {
		alias: {
			'~': path.resolve(rootDir, './src')
		}
	}
})
