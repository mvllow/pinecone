import fs from 'node:fs'
import path from 'node:path'
import slugify from 'slugify'
import { resolveConfig } from './config.js'

export async function tidy() {
	const { options, variants } = await resolveConfig()

	const safeList: string[] = [path.basename(options.source)]

	for (const variant of Object.keys(variants)) {
		// @ts-expect-error Use better types
		const { name } = variants[variant]
		const slug = slugify(name, { lower: true, strict: true })

		safeList.push(
			`${slug}-color-theme.json`,
			`${slug}-no-italics-color-theme.json`,
		)
	}

	fs.readdir(options.output, (error, files) => {
		if (error) {
			console.error(error.message)
		}

		for (const file of files) {
			const fileDir = path.join(options.output, file)

			if (!safeList.includes(file) && file.includes('-color-theme.json')) {
				fs.unlinkSync(fileDir)
			}
		}
	})
}
