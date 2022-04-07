import path from 'node:path'
import slugify from 'slugify'
import { type Config } from '../config.js'
import { readJson } from './read-json.js'

export function checkThemes({ options, variants }: Config) {
	const firstVariant = Object.keys(variants)[0]

	if (typeof firstVariant === 'undefined') {
		throw new TypeError('No themes found')
	}

	const selectedVariant = variants[firstVariant]

	const slug = slugify(selectedVariant?.name ?? '', {
		lower: true,
		strict: true,
	})
	const theme = readJson(path.join(options.output, `${slug}-color-theme.json`))

	checkValues(theme)

	if (!options.source.includes('color-theme')) {
		console.warn(
			'Include `color-theme` in your source name to enable intellisense',
		)
	}

	function checkValues(source: Record<string, unknown>): void {
		for (const key in source) {
			if (key) {
				const currentValue = source[key]

				if (typeof currentValue === 'object') {
					checkValues(currentValue as Record<string, unknown>)
					return
				}

				if (typeof currentValue === 'undefined') {
					console.warn(`Color is undefined`)
					return
				}

				if (typeof currentValue === 'string') {
					if (currentValue.includes('[object Object]')) {
						console.warn(
							`Color has invalid value\n{ "${key}": "${currentValue}" }`,
						)
						return
					}

					if (currentValue.includes(options.prefix)) {
						console.warn(
							`Color was not formatted\n{ "${key}": "${currentValue}" }`,
						)
						return
					}

					if (currentValue.includes('#ff0000')) {
						console.warn(
							`Color has default value\nThis usually occurs when a color is not formatted\n{ "${key}": "${currentValue}" }`,
						)
						return
					}
				}
			}
		}
	}
}
