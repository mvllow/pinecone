import type { Theme } from './parse-themes.js'
import type { UserOptions } from '../config.js'

import path from 'path'
import slugify from 'slugify'
import { writePrettyFile } from './write-pretty-file.js'
import { resolveConfig } from '../config.js'

interface Themes {
	[key: string]: Theme
}

export async function generateThemes(themes: Themes, flags?: UserOptions) {
	let { options } = await resolveConfig(flags)
	let variants: any[] = []

	await Promise.all(
		Object.keys(themes).map(async (variant) => {
			// @ts-expect-error Use better types
			let slug = slugify(themes[variant].name || '', {
				lower: true,
				strict: true,
			})

			await writePrettyFile(
				path.join(options.output, `${slug}-color-theme.json`),
				JSON.stringify(themes[variant], null, 2)
			)

			// @ts-expect-error Use better types
			if (!themes[variant].name?.includes('(no italics)')) {
				if (options.includeNonItalicVariants) {
					variants.push(
						// @ts-expect-error Use better types
						`${themes[variant].name} / ${themes[variant].name} (no italics)`
					)
				} else {
					// @ts-expect-error Use better types
					variants.push(themes[variant].name)
				}
			}
		})
	)

	return variants
}
