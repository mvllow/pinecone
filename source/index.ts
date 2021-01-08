import chalk from 'chalk'
import { TypedFlags } from 'meow'
import { init } from './init'
import { validateConfig } from './utils/validate-config'
import { parseThemes } from './utils/parse-themes'
import { generateThemes } from './utils/generate-themes'
import { getConfig, Options } from './utils/get-config'
import { readJson } from './utils/read-json'
import { writeMeta } from './utils/write-meta'

type OptionKeys = keyof Options

type Flags = TypedFlags<
  {
    [K in OptionKeys]: { type: 'boolean' }
  }
> &
  Record<string, unknown>

const pinecone = async (command?: string, flags?: Partial<Flags>) => {
  console.clear()
  console.log(chalk.green('🌲 Pinecone'))
  console.log()

  if (command === 'init') {
    await init()
    console.log('🌱 Init')
    console.log(
      `   ${chalk.grey('-')} Created config file: ${chalk.magenta(
        'pinecone.config.js'
      )}`
    )
    console.log(
      `   ${chalk.grey('-')} Created base theme file: ${chalk.magenta(
        'themes/_pinecone-color-theme-json'
      )}`
    )
    console.log()
  }

  let { themeFile, options } = getConfig()
  options = { ...options, ...flags }

  if (validateConfig()) {
    let template = await readJson(themeFile)
    let parsedThemes = await parseThemes(template, options)
    let generatedThemes = await generateThemes(parsedThemes, options)

    console.log(`🌿 Variants`)
    generatedThemes.forEach((theme) => {
      console.log(`   ${chalk.grey('-')} ${chalk.magenta(theme)}`)
    })
    console.log()

    if (options?.writeMeta) {
      await writeMeta(options)
      console.log(`📦 Added variants to package.json`)
      console.log()
    }
  }
}

export default pinecone
