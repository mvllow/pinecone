import type { UserOptions } from '../config.js'

import { log } from './pretty-log.js'
import { replaceJsonValues } from './replace-json-values.js'
import { removeWordFromString } from './remove-word-from-string.js'
import { resolveConfig } from '../config.js'

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
	flags?: UserOptions
) {
	let stringifiedTheme = JSON.stringify(baseTheme)
	let { options, variants, colors } = await resolveConfig(flags)
	let result: { [key: string]: Theme } = {}

	Object.keys(variants).forEach((variant) => {
		let workingTheme = stringifiedTheme

		Object.keys(colors).forEach((color) => {
			let searchFor = `${options.prefix}${color}`

			let currentColor = colors[color]
			let replaceWith =
				// @ts-expect-error Use better types
				typeof currentColor == 'string' ? currentColor : currentColor[variant]

			if (replaceWith) {
				workingTheme = replaceJsonValues(workingTheme, searchFor, replaceWith)
			} else {
				log.error(`Bad format for \`${color}\``)
			}
		})

		let parsedWorkingTheme = JSON.parse(workingTheme)

		// Remove empty JSON values
		Object.keys(parsedWorkingTheme.colors).forEach((key) => {
			if (parsedWorkingTheme.colors[key] === '') {
				delete parsedWorkingTheme.colors[key]
			}
		})

		result[variant] = {
			name: variants[variant]?.name,
			type: variants[variant]?.type,
			...parsedWorkingTheme,
		}

		if (options.includeNonItalicVariants) {
			let nonItalicVariant = removeWordFromString(workingTheme, 'italic')

			result[`${variant}-no-italics`] = {
				name: `${variants[variant]?.name} (no italics)`,
				type: variants[variant]?.type,
				...JSON.parse(nonItalicVariant),
			}
		}
	})

	return result
}
