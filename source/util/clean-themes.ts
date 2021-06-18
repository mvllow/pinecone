import fs from 'fs'
import path from 'path'
import slugify from 'slugify'
import { log } from './pretty-log.js'
import { getConfig } from '../config.js'

export async function cleanThemes() {
	let {
		source,
		output,
		theme: { variants },
	} = await getConfig()

	let safeList: string[] = [path.basename(source)]

	Object.keys(variants).forEach((variant) => {
		let { name } = variants[variant]
		let slug = slugify(name, { lower: true, strict: true })

		safeList.push(`${slug}-color-theme.json`)
		safeList.push(`${slug}-no-italics-color-theme.json`)
	})

	fs.readdir(output, (error, files) => {
		if (error) {
			log.error(error.message)
		}

		files.forEach((file) => {
			const fileDir = path.join(output, file)

			if (!safeList.includes(file) && file.includes('-color-theme.json')) {
				fs.unlinkSync(fileDir)
			}
		})
	})
}
