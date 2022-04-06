import fs from 'fs'
import path from 'path'
import slugify from 'slugify'
import { log } from './pretty-log.js'
import { resolveConfig } from '../config.js'

export async function tidy() {
	let { options, variants } = await resolveConfig()

	let safeList: string[] = [path.basename(options.source)]

	Object.keys(variants).forEach((variant) => {
		// @ts-expect-error Use better types
		let { name } = variants[variant]
		let slug = slugify(name, { lower: true, strict: true })

		safeList.push(`${slug}-color-theme.json`)
		safeList.push(`${slug}-no-italics-color-theme.json`)
	})

	fs.readdir(options.output, (error, files) => {
		if (error) {
			log.error(error.message)
		}

		files.forEach((file) => {
			const fileDir = path.join(options.output, file)

			if (!safeList.includes(file) && file.includes('-color-theme.json')) {
				fs.unlinkSync(fileDir)
			}
		})
	})
}
