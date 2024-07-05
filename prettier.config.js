/** @type {import('prettier').Config & import('prettier-plugin-tailwindcss').PluginOptions} */
const config = {
	plugins: ['prettier-plugin-tailwindcss'],
	semi: false,
	singleQuote: true,
	trailingComma: 'none',
	bracketSpacing: true,
	bracketSameLine: false,
	arrowParens: 'avoid',
	tabWidth: 2,
	quoteProps: 'as-needed',
	jsxSingleQuote: true,
	useTabs: true
}

export default config
