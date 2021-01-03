import chalk from 'chalk'
import { AnyFlags, TypedFlags } from 'meow'
import { init } from './init'
import { validateConfig } from './utils/validate-config'
import { getTheme } from './utils/get-theme'
import { parseThemes } from './utils/parse-themes'
import { writeThemes } from './utils/write-themes'

const pinecone = async (command?: string, options?: TypedFlags<AnyFlags>) => {
  console.clear()
  console.log(chalk.green('🌲 Pinecone'))

  if (command === 'init') {
    await init()
  }

  validateConfig()
  let theme = getTheme()
  let parsedThemes = parseThemes(theme)
  writeThemes(parsedThemes)
}

export default pinecone
