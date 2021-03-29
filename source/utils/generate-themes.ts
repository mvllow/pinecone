import path from 'path'
import slugify from 'slugify'
import { getConfig, Options } from './get-config'
import { Theme } from './parse-themes'
import { writePrettyFile } from './write-pretty-file'

interface Themes {
	[key: string]: Theme
}

export const generateThemes = async (themes: Themes, options: Options) => {
	let { outputDir } = getConfig()
	let variants: any[] = []

	await Promise.all(
		Object.keys(themes).map(async (variant) => {
			let slug = slugify(themes[variant].name || '', {
				lower: true,
				strict: true,
			})

			await writePrettyFile(
				path.join(outputDir, `${slug}-color-theme.json`),
				JSON.stringify(themes[variant], null, 2)
			)

			if (!themes[variant].name?.includes('(no italics)')) {
				if (options.includeNonItalics || options.includeNonItalicVariants) {
					variants.push(`${themes[variant].name} / ${themes[variant].name} (no italics)`)
				} else {
					variants.push(themes[variant].name)
				}
			}
		})
	)

	return variants
}
