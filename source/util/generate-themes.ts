import type { Theme } from './parse-themes.js'
import type { Options } from '../config.js'

import path from 'path'
import slugify from 'slugify'
import { writePrettyFile } from './write-pretty-file.js'
import { getConfig } from '../config.js'

interface Themes {
	[key: string]: Theme
}

export async function generateThemes(themes: Themes, options: Options) {
	let { output } = await getConfig()
	let variants: any[] = []

	await Promise.all(
		Object.keys(themes).map(async (variant) => {
			let slug = slugify(themes[variant].name || '', {
				lower: true,
				strict: true,
			})

			await writePrettyFile(
				path.join(output, `${slug}-color-theme.json`),
				JSON.stringify(themes[variant], null, 2)
			)

			if (!themes[variant].name?.includes('(no italics)')) {
				if (options.includeNonItalicVariants) {
					variants.push(
						`${themes[variant].name} / ${themes[variant].name} (no italics)`
					)
				} else {
					variants.push(themes[variant].name)
				}
			}
		})
	)

	return variants
}
