import type { UserOptions } from '../config.js'

import path from 'path'
import slugify from 'slugify'
import { readJson } from './read-json.js'
import { writePrettyFile } from './write-pretty-file.js'
import { resolveConfig } from '../config.js'

interface VSTheme {
	label: string
	uiTheme: 'vs' | 'vs-dark'
	path: string
}

export async function updateContributes(flags?: UserOptions) {
	let themes: VSTheme[] = []
	let { options, variants } = await resolveConfig(flags)
	let packageJson = readJson('package.json')

	Object.keys(variants).map((variant) => {
		// @ts-expect-error Use better types
		let { name, type } = variants[variant]
		let slug = slugify(name, { lower: true, strict: true })

		themes.push({
			label: name,
			uiTheme: type == 'light' ? 'vs' : 'vs-dark',
			path: path.join(options.output, `${slug}-color-theme.json`),
		})

		if (options.includeNonItalicVariants) {
			themes.push({
				label: `${name} (no italics)`,
				uiTheme: type == 'light' ? 'vs' : 'vs-dark',
				path: path.join(
					options.output,
					`./${slug}-no-italics-color-theme.json`
				),
			})
		}
	})

	if (!packageJson.contributes) {
		packageJson.contributes = { themes: [] }
	}
	packageJson.contributes.themes = themes

	await writePrettyFile(
		'package.json',
		JSON.stringify(packageJson, null, 2),
		'json-stringify'
	)
}
