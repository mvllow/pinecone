import path from 'node:path'
import slugify from 'slugify'
import { type Config } from '../config.js'
import type { Theme } from './parse-themes.js'
import { writePrettyFile } from './write-pretty-file.js'

type Themes = Record<string, Theme>

export async function generateThemes(themes: Themes, { options }: Config) {
	const variants: string[] = []

	await Promise.all(
		Object.keys(themes).map(async (variant) => {
			const currentVariant = themes[variant]

			if (typeof currentVariant !== 'undefined') {
				const slug = slugify(currentVariant.name ?? '', {
					lower: true,
					strict: true,
				})

				await writePrettyFile(
					path.join(options.output, `${slug}-color-theme.json`),
					JSON.stringify(currentVariant, null, 2),
				)

				if (typeof currentVariant.name !== 'undefined') {
					if (options.includeNonItalicVariants) {
						variants.push(`${currentVariant?.name ?? ''} (no italics)`)
					} else {
						variants.push(currentVariant.name)
					}
				}
			}
		}),
	)

	return variants
}
