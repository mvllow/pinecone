import type { Options } from '../config.js'

import { log } from './pretty-log.js'
import { replaceJsonValues } from './replace-json-values.js'
import { removeWordFromString } from './remove-word-from-string.js'
import { getConfig } from '../config.js'

export interface Theme {
	name?: string
	type?: 'light' | 'dark'
	/**
	 * @example bg: '#000' or bg: { dark: '#000', light: '#fff' }
	 */
	colors?: {
		[key: string]:
			| string
			| {
					[key: string]: string
			  }
	}
	tokenColors?: unknown[]
	semanticHighlighting?: boolean
	semanticTokenColors?: {}
	[key: string]: unknown
}

export async function parseThemes(
	{ name, type, ...baseTheme }: Theme,
	options: Options
) {
	let stringifiedTheme = JSON.stringify(baseTheme)
	let { prefix, theme } = await getConfig()
	let result: { [key: string]: Theme } = {}

	Object.keys(theme.variants).forEach((variant) => {
		let workingTheme = stringifiedTheme

		Object.keys(theme.colors).forEach((color) => {
			let searchFor = `${prefix}${color}`

			let currentColor = theme.colors[color]
			let replaceWith =
				typeof currentColor == 'string' ? currentColor : currentColor[variant]

			if (replaceWith) {
				workingTheme = replaceJsonValues(workingTheme, searchFor, replaceWith)
			} else {
				log.error(`Bad format for \`${color}\``)
			}
		})

		let parsedWorkingTheme = JSON.parse(workingTheme)

		if (options.experimental?.removeEmptyThemeValues) {
			Object.keys(parsedWorkingTheme.colors).forEach((key) => {
				if (parsedWorkingTheme.colors[key] === '') {
					// Remove empty JSON values
					delete parsedWorkingTheme.colors[key]
				}
			})
		}

		result[variant] = {
			name: theme.variants[variant]?.name,
			type: theme.variants[variant]?.type,
			...parsedWorkingTheme,
		}

		if (options.includeNonItalicVariants) {
			let nonItalicVariant = removeWordFromString(workingTheme, 'italic')

			result[`${variant}-no-italics`] = {
				name: `${theme.variants[variant]?.name} (no italics)`,
				type: theme.variants[variant]?.type,
				...JSON.parse(nonItalicVariant),
			}
		}
	})

	return result
}
