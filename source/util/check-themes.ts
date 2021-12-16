import type { Config } from '../config.js'

import path from 'path'
import slugify from 'slugify'
import { log } from './pretty-log.js'
import { readJson } from './read-json.js'

function checkForValue(json: any, value: any): any {
	for (const key in json) {
		if (typeof json[key] === 'object') {
			return checkForValue(json[key], value)
		}
		if (json[key].includes('[object Object]')) {
			log.suggest(`Color has invalid value\n{ "${key}": "${json[key]}" }`)
		}
		if (json[key].includes(value)) {
			log.suggest(`Color was not formatted\n{ "${key}": "${json[key]}" }`)
		}
		if (json[key].includes('#ff0000')) {
			log.suggest(
				`Color has default value\nThis usually occurs when a color is not formatted\n{ "${key}": "${json[key]}" }`
			)
		}
	}
}

export function checkThemes(config: Config) {
	let { options, variants } = config
	// @ts-expect-error Use better types
	let name = variants[Object.keys(variants)[0]].name
	const slug = slugify(name, {
		lower: true,
		strict: true,
	})
	const baseTheme = readJson(
		path.join(options.output, `${slug}-color-theme.json`)
	)

	checkForValue(baseTheme, options.prefix)

	if (!options.source.includes('color-theme')) {
		log.suggest(
			'Include `color-theme` in your source name to enable intellisense'
		)
	}
}
