import type { TypedFlags } from 'meow'
import type { Options } from './config.js'

import chalk from 'chalk'
import alpha from 'colorish'
import { watch } from './commands/watch.js'
import { cleanThemes } from './util/clean-themes.js'
import { parseThemes } from './util/parse-themes.js'
import { generateThemes } from './util/generate-themes.js'
import { readJson } from './util/read-json.js'
import { updateContributes } from './util/update-contributes.js'
import { getConfig, checkConfig, defineConfig } from './config.js'

type OptionKeys = keyof Options
type Flags = TypedFlags<
	{
		[K in OptionKeys]: { type: 'boolean' }
	}
> &
	Record<string, unknown>

async function pinecone(command?: string, flags?: Partial<Flags>) {
	console.clear()
	console.log(chalk.green('🌲 Pinecone\n'))

	let config = await getConfig()

	let resolvedOptions = { ...config.options, ...flags }

	if (checkConfig(config)) {
		let template = await readJson(config.source)
		let parsedThemes = await parseThemes(template, resolvedOptions)
		let generatedThemes = await generateThemes(parsedThemes, resolvedOptions)

		console.log(`🌿 Variants`)
		generatedThemes.forEach((theme) => {
			console.log(`   ${chalk.grey('-')} ${chalk.magenta(theme)}`)
		})
		console.log()

		cleanThemes()

		if (resolvedOptions?.updateContributes) {
			await updateContributes(resolvedOptions)
			console.log(`📦 Added variants to package.json\n`)
		}

		if (command === 'watch') {
			console.log('👀 Waiting for changes...\n')
			await watch()
		}
	}
}

export { alpha, defineConfig }
export default pinecone
