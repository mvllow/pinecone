import chalk from 'chalk'
import { TypedFlags } from 'meow'
import { init } from './init'
import { validateConfig } from './utils/validate-config'
import { parseThemes } from './utils/parse-themes'
import { generateThemes } from './utils/generate-themes'
import { getConfig, Options } from './utils/get-config'
import { readJson } from './utils/read-json'

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

  if (command === 'init') {
    await init()
  }

  let { themeFile, options } = getConfig()
  options = { ...options, ...flags }

  if (validateConfig()) {
    let theme = readJson(themeFile)
    let parsedThemes = parseThemes(theme, options)

    await generateThemes(parsedThemes, options)
  }
}

export default pinecone
