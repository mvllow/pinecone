import chalk from 'chalk'
// TODO: Export as colorish
import { colorish as alpha } from 'colorish'
import { init } from './init.js'
import { tidy } from './tidy.js'
import { watch } from './watch.js'
import { resolveConfig, defineConfig, type UserOptions } from './config.js'
import { parseThemes } from './util/parse-themes.js'
import { generateThemes } from './util/generate-themes.js'
import { readJson } from './util/read-json.js'
import { updateContributes } from './util/update-contributes.js'
import { checkThemes } from './util/check-themes.js'

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

	if (config.options.tidy) tidy()

	checkThemes(config)

	if (config.options?.updateContributes) {
		await updateContributes(config.options)
		console.log(`📦 Added variants to package.json\n`)
	}

	if (config.options?.watch) {
		console.log('👀 Waiting for changes...\n')
		await watch()
	}
}

export { alpha, defineConfig }
export default pinecone
