import { log } from './pretty-log'
import { Config, getConfig } from './get-config'

interface DeprecatedConfig extends Config {
  themes?: string[]
}

export const validateConfig = () => {
  let config: DeprecatedConfig = getConfig()

  if (!config.themeFile?.includes('color-theme')) {
    log.suggest(
      'Include `color-theme` in your themeFile name to enable intellisense completions'
    )
  }

  if (config.themes?.length) {
    log.suggest(`Oops! Looks like you're using the old API`)
    log.suggest(`https://github.com/mvllow/pinecone#readme`)
    return false
  }

  return true
}
