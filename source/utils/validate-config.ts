import { log } from './log'
import { getConfig } from './get-config'

export const validateConfig = () => {
  let config = getConfig()

  if (!config.themeFile?.includes('color-theme')) {
    log.suggest(
      'Include `color-theme` in your themeFile name to enable intellisense completions'
    )
  }
}
