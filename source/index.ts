import chalk from 'chalk'
import { init } from './init.js'
import { tidy } from './tidy.js'
import { watch } from './watch.js'
import { resolveConfig, type UserOptions } from './config.js'
import { parseThemes } from './util/parse-themes.js'
import { generateThemes } from './util/generate-themes.js'
import { readJson } from './util/read-json.js'
import { updateContributes } from './util/update-contributes.js'
import { checkThemeValues } from './util/check-themes.js'

async function pinecone(command?: string, flags?: UserOptions) {
	console.clear()
	console.log(chalk.green('🌲 Pinecone\n'))

	if (command === 'init') {
		await init()
		return
	}

	const config = await resolveConfig(flags)

	const template = readJson(config.options.source)
	const parsedThemes = await parseThemes(template, config.options)
	const generatedThemes = await generateThemes(parsedThemes, config.options)

	console.log(`🌿 Variants`)
	for (const theme of generatedThemes) {
		console.log(`   ${chalk.grey('-')} ${chalk.magenta(theme)}`)
	}

	if (config.options.tidy) await tidy()

	checkThemeValues(config)

	if (config.options?.updateContributes) {
		await updateContributes(config.options)
		console.log(`📦 Added variants to package.json\n`)
	}

	if (config.options?.watch) {
		console.log('👀 Waiting for changes...\n')
		await watch()
	}
}

export { colorish } from 'colorish'
export { defineConfig } from './config.js'
export default pinecone
