import chalk from 'chalk'
import { TypedFlags } from 'meow'
import { init } from './init'
import { getConfig } from './utils/get-config'
import { validateConfig } from './utils/validate-config'
import { getTheme } from './utils/get-theme'
import { parseThemes } from './utils/parse-themes'
import { writeThemes } from './utils/write-themes'

// TODO: make type dynamic
type Options = TypedFlags<{ includeNonItalicVariants: { type: 'boolean' } }> &
  Record<string, unknown>

const pinecone = async (command?: string, options?: Options) => {
  console.clear()
  console.log(chalk.green('🌲 Pinecone'))

  if (command === 'init') {
    await init()
  }

  let config = getConfig()

  if (validateConfig()) {
    let theme = getTheme()

    let includeNonItalicVariants =
      options?.includeNonItalicVariants ||
      config.options?.includeNonItalicVariants ||
      false

    let parsedThemes = parseThemes(theme, { includeNonItalicVariants })

    await writeThemes(parsedThemes)
  }
}

export default pinecone
