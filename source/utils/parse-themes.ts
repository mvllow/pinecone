import { log } from './log'
import { getConfig, Options } from './get-config'
import { Theme } from './get-theme'
import { replaceJsonValues } from './replace-json-values'
import { removeWordFromString } from './remove-word-from-string'

export const parseThemes = (
  { name, type, ...theme }: Theme,
  options?: Options
) => {
  let stringifiedTheme = JSON.stringify(theme)
  let config = getConfig()
  let result: { [key: string]: Theme } = {}

  Object.keys(config.theme.variants).forEach((variant) => {
    let workingTheme = stringifiedTheme

    Object.keys(config.theme.colors).forEach((color) => {
      let searchFor = `${config.varPrefix}${color}`

      let currentColor = config.theme.colors[color]
      let replaceWith

      if (typeof currentColor === 'object') {
        replaceWith = currentColor[variant] || ''
      } else if (typeof currentColor === 'string') {
        replaceWith = currentColor
      }

      if (replaceWith) {
        workingTheme = replaceJsonValues(workingTheme, searchFor, replaceWith)
      } else {
        log.error(`Bad format for \`${color}\``)
      }
    })

    result[variant] = {
      name: config.theme.variants[variant]?.name,
      type: config.theme.variants[variant]?.type,
      ...JSON.parse(workingTheme),
    }

    if (options?.includeNonItalicVariants) {
      let nonItalicVariant = removeWordFromString(workingTheme, 'italic')

      result[`${variant}-no-italics`] = {
        name: `${config.theme.variants[variant]?.name} (no italics)`,
        type: config.theme.variants[variant]?.type,
        ...JSON.parse(nonItalicVariant),
      }
    }
  })

  return result
}
