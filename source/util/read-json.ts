import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'

/**
 * Read JSON
 * JSON comments will be stripped before parsing
 *
 * @param file starts from root
 * @returns parsed JSON
 */
export function readJson<T>(file: string): T {
	try {
		let contents = fs.readFileSync(path.join(process.cwd(), file), 'utf8')

		// Remove comment lines
		contents = contents.replace(
			/\\"|"(?:\\"|[^"])*"|(\/\/.*|\/\*[\s\S]*?\*\/)/g,
			(m, g) => (g ? '' : m),
		)

		return JSON.parse(contents) as T
	} catch {
		throw new Error(`Unable to read JSON file: ${file}`)
	}
}
