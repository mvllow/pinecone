import type { Options } from '../config.js'

import path from 'path'
import slugify from 'slugify'
import { readJson } from './read-json.js'
import { writePrettyFile } from './write-pretty-file.js'
import { getConfig } from '../config.js'

interface VSTheme {
	label: string
	uiTheme: 'vs' | 'vs-dark'
	path: string
}

export async function updateContributes(options: Options) {
	let themes: VSTheme[] = []
	let { output, theme } = await getConfig()
	let packageJson = readJson('package.json')

	Object.keys(theme.variants).map((variant) => {
		let { name, type } = theme.variants[variant]
		let slug = slugify(name, { lower: true, strict: true })

		themes.push({
			label: name,
			uiTheme: type == 'light' ? 'vs' : 'vs-dark',
			path: path.join(output, `${slug}-color-theme.json`),
		})

		if (options.includeNonItalicVariants) {
			themes.push({
				label: `${name} (no italics)`,
				uiTheme: type == 'light' ? 'vs' : 'vs-dark',
				path: path.join(output, `./${slug}-no-italics-color-theme.json`),
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
