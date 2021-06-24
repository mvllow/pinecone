import fs from 'fs'
import path from 'path'
import { log } from './pretty-log.js'

/**
 * Read JSON
 * JSON comments will be stripped before parsing
 *
 * @param file starts from root
 * @returns parsed JSON
 */
export function readJson(file: string) {
	try {
		let contents = fs.readFileSync(path.join(process.cwd(), file), 'utf8')
		contents = contents.replace(/\\"|"(?:\\"|[^"])*"|(\/\/.*|\/\*[\s\S]*?\*\/)/g, (m, g) => g ? "" : m);

		return JSON.parse(contents)
	} catch (error) {
		log.error(error)
	}
}
