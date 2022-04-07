import fs from 'node:fs'
import path from 'node:path'
import slugify from 'slugify'
import { readJson } from './util/read-json.js'
import { writePrettyFile } from './util/write-pretty-file.js'
import { type Config } from './config.js'

interface CodeTheme {
	label: string
	uiTheme: 'vs' | 'vs-dark'
	path: string
}

export async function tidy({ options, variants }: Config) {
	const packageJson = readJson('package.json')

	const safeFiles: string[] = [path.basename(options.source)]
	const themes: CodeTheme[] = []

	for (const variant of Object.keys(variants)) {
		const currentVariant = variants[variant]

		if (typeof currentVariant !== 'undefined') {
			const { name, type } = currentVariant
			const slug = slugify(name, { lower: true, strict: true })

			safeFiles.push(`${slug}-color-theme.json`)
			themes.push({
				label: name,
				uiTheme: type === 'light' ? 'vs' : 'vs-dark',
				path: path.join(options.output, `./${slug}-color-theme.json`),
			})

			if (options.includeNonItalicVariants) {
				safeFiles.push(`${slug}-no-italics-color-theme.json`)
				themes.push({
					label: `${name} (no italics)`,
					uiTheme: type === 'light' ? 'vs' : 'vs-dark',
					path: path.join(
						options.output,
						`./${slug}-no-italics-color-theme.json`,
					),
				})
			}
		}
	}

	// Remove non-pinecone themes from output directory
	fs.readdir(options.output, (error, files) => {
		if (error) {
			console.error(error.message)
		}

		for (const file of files) {
			const filePath = path.join(options.output, file)

			if (!safeFiles.includes(file) && file.includes('-color-theme.json')) {
				fs.unlinkSync(filePath)
			}
		}
	})

	// Add pinecone themes to package.json contributes section
	Object.assign(packageJson['contributes'], themes)

	await writePrettyFile(
		'package.json',
		JSON.stringify(packageJson, null, 2),
		'json-stringify',
	)
}
