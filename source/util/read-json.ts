import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { type Theme } from './parse-themes.js'

/**
 * Read JSON
 * JSON comments will be stripped before parsing
 *
 * @param file starts from root
 * @returns parsed JSON
 */
export function readJson(file: string): Theme {
	try {
		let contents = fs.readFileSync(path.join(process.cwd(), file), 'utf8')

		// Remove comment lines
		contents = contents.replace(
			/\\"|"(?:\\"|[^"])*"|(\/\/.*|\/\*[\s\S]*?\*\/)/g,
			(m, g) => (g ? '' : m),
		)

		return JSON.parse(contents) as Theme
	} catch {
		throw new Error(`Unable to read JSON theme file: ${file}`)
	}
}
