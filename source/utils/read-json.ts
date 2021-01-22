import fs from 'fs'
import path from 'path'
import { log } from './pretty-log'

/**
 * Read JSON
 *
 * @param file starts from root
 * @returns parsed JSON
 */
export const readJson = (file: string) => {
	try {
		return JSON.parse(fs.readFileSync(path.join(process.cwd(), file), 'utf8'))
	} catch (error) {
		log.error(error)
	}
}
