import path from 'node:path'
import slugify from 'slugify'
import { resolveConfig, type UserOptions } from '../config.js'
import { readJson } from './read-json.js'
import { writePrettyFile } from './write-pretty-file.js'

interface CodeTheme {
	label: string
	uiTheme: 'vs' | 'vs-dark'
	path: string
}

export async function updateContributes(flags?: UserOptions) {
	const themes: CodeTheme[] = []
	const { options, variants } = await resolveConfig(flags)
	const packageJson = readJson('package.json')

	Object.keys(variants).map((variant) => {
		const { name, type } = variants[variant] as {
			name: string
			type: 'light' | 'dark'
		}
		const slug = slugify(name, { lower: true, strict: true })

		themes.push({
			label: name,
			uiTheme: type === 'light' ? 'vs' : 'vs-dark',
			path: path.join(options.output, `${slug}-color-theme.json`),
		})

		if (options.includeNonItalicVariants) {
			themes.push({
				label: `${name} (no italics)`,
				uiTheme: type === 'light' ? 'vs' : 'vs-dark',
				path: path.join(
					options.output,
					`./${slug}-no-italics-color-theme.json`,
				),
			})
		}

		return themes
	})

	Object.assign(packageJson['contributes'], themes || [])

	await writePrettyFile(
		'package.json',
		JSON.stringify(packageJson, null, 2),
		'json-stringify',
	)
}
