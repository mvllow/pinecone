import { type Config } from '../config.js'
import { replaceJsonValues } from './replace-json-values.js'
import { removeWordFromString } from './remove-word-from-string.js'

export interface Theme {
	[key: string]: unknown
	name?: string
	type?: 'light' | 'dark'
	/**
	 * @example bg: '#000' or bg: { dark: '#000', light: '#fff' }
	 */
	colors?: Record<string, string | Record<string, string>>
	tokenColors?: unknown[]
	semanticHighlighting?: boolean
	semanticTokenColors?: Record<string, unknown>
}

export async function parseThemes(
	{ name, type, ...baseTheme }: Theme,
	{ options, variants, colors }: Config,
) {
	const stringifiedTheme = JSON.stringify(baseTheme)
	const result: Record<string, Theme> = {}

	for (const variant of Object.keys(variants)) {
		let workingTheme = stringifiedTheme

		for (const color of Object.keys(colors)) {
			const searchFor = `${options.prefix}${color}`

			const currentColor = colors[color]
			const replaceWith =
				// @ts-expect-error TODO
				typeof currentColor === 'string' ? currentColor : currentColor[variant]

			if (replaceWith) {
				workingTheme = replaceJsonValues(workingTheme, searchFor, replaceWith)
			} else {
				console.error(`Bad format for \`${color}\``)
			}
		}

		const parsedWorkingTheme = JSON.parse(workingTheme)

		// Remove empty JSON values
		for (const key of Object.keys(parsedWorkingTheme.colors)) {
			if (parsedWorkingTheme.colors[key] === '') {
				delete parsedWorkingTheme.colors[key]
			}
		}

		result[variant] = {
			name: variants[variant]?.name,
			type: variants[variant]?.type,
			...parsedWorkingTheme,
		}

		if (options.includeNonItalicVariants) {
			const nonItalicVariant = removeWordFromString(workingTheme, 'italic')

			result[`${variant}-no-italics`] = {
				name: `${variants[variant]?.name} (no italics)`,
				type: variants[variant]?.type,
				...JSON.parse(nonItalicVariant),
			}
		}
	}

	return result
}
