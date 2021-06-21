import fs from 'fs'
import prettier from 'prettier'
import { log } from './pretty-log.js'

/**
 * Write prettier file
 *
 * @param filePath starts from root
 * @param fileContents
 * @param parser parser used by prettier
 *
 */
export async function writePrettyFile(
	filePath: string,
	fileContents: string,
	parser: string = 'json'
) {
	try {
		await prettier.resolveConfig(process.cwd()).then((options) => {
			let formattedContents = prettier.format(fileContents, {
				...options,
				parser,
			})

			fs.writeFileSync(`./${filePath}`, formattedContents, 'utf-8')
		})
	} catch (error) {
		log.error(error)
	}
}
