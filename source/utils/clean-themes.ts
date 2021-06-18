import fs from 'fs'
import path from 'path'
import slugify from 'slugify'
import { log } from './pretty-log'
import { getConfig } from './get-config'

export const cleanThemes = async () => {
	let {
		themeFile,
		outputDir,
		theme: { variants },
	} = getConfig()

	let safeList: string[] = [path.basename(themeFile)]

	Object.keys(variants).forEach((variant) => {
		let { name } = variants[variant]
		let slug = slugify(name, { lower: true, strict: true })

		safeList.push(`${slug}-color-theme.json`)
		safeList.push(`${slug}-no-italics-color-theme.json`)
	})

	fs.readdir(outputDir, (error, files) => {
		if (error) {
			log.error(error.message)
		}

		files.forEach((file) => {
			const fileDir = path.join(outputDir, file)

			if (!safeList.includes(file) && file.includes('-color-theme.json')) {
				fs.unlinkSync(fileDir)
			}
		})
	})
}
