import fs from 'fs'
import path from 'path'
import prettier from 'prettier'
import { log } from './pretty-log'

/**
 * Write prettier file
 *
 * @param filePath starts from root
 * @param fileContents
 * @param parser parser used by prettier
 *
 */
export const writePrettyFile = async (
	filePath: string,
	fileContents: string,
	parser: string = 'json'
) => {
	try {
		await prettier.resolveConfig(process.cwd()).then((options) => {
			let formattedContents = prettier.format(fileContents, {
				...options,
				parser,
			})

			fs.writeFileSync(path.join(process.cwd(), filePath), formattedContents)
		})
	} catch (error) {
		log.error(error)
	}
}
