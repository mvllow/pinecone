import type { UserOptions } from './config.js'

import chalk from 'chalk'
import { colorish as alpha } from 'colorish'
import { watch } from './commands/watch.js'
import { init } from './init.js'
import { cleanThemes } from './util/clean-themes.js'
import { parseThemes } from './util/parse-themes.js'
import { generateThemes } from './util/generate-themes.js'
import { readJson } from './util/read-json.js'
import { updateContributes } from './util/update-contributes.js'
import { checkThemes } from './util/check-themes.js'
import { resolveConfig, defineConfig } from './config.js'

async function pinecone(command?: string, flags?: UserOptions) {
	console.clear()
	console.log(chalk.green('🌲 Pinecone\n'))

	if (command === 'init') {
		await init()
		return
	}

	let config = await resolveConfig(flags)

	let template = await readJson(config.options.source)
	let parsedThemes = await parseThemes(template, config.options)
	let generatedThemes = await generateThemes(parsedThemes, config.options)

	console.log(`🌿 Variants`)
	generatedThemes.forEach((theme) => {
		console.log(`   ${chalk.grey('-')} ${chalk.magenta(theme)}`)
	})
	console.log()

	// TODO: Remove check for `clean` in v3
	// This was released in v2.2.0 but replaced with an option instead of command in v2.3.0 (now undocumented)
	if (config.options?.cleanUnusedThemes || command === 'clean') {
		cleanThemes()
	}

	checkThemes(config)

	if (config.options?.updateContributes) {
		await updateContributes(config.options)
		console.log(`📦 Added variants to package.json\n`)
	}

	if (command === 'watch') {
		console.log('👀 Waiting for changes...\n')
		await watch()
	}
}

export { alpha, defineConfig }
export default pinecone
