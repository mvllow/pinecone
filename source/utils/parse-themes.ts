import { log } from './pretty-log'
import { getConfig, Options } from './get-config'
import { replaceJsonValues } from './replace-json-values'
import { removeWordFromString } from './remove-word-from-string'

export interface Theme {
  name?: string
  type?: 'light' | 'dark'
  /**
   * @example bg: '#000' or bg: { dark: '#000', light: '#fff' }
   */
  colors?: {
    [key: string]:
      | string
      | {
          [key: string]: string
        }
  }
  tokenColors?: unknown[]
  semanticHighlighting?: boolean
  semanticTokenColors?: {}
  [key: string]: unknown
}

export const parseThemes = (
  { name, type, ...baseTheme }: Theme,
  options: Options
) => {
  let stringifiedTheme = JSON.stringify(baseTheme)
  let { theme, varPrefix } = getConfig()
  let result: { [key: string]: Theme } = {}

  Object.keys(theme.variants).forEach((variant) => {
    let workingTheme = stringifiedTheme

    Object.keys(theme.colors).forEach((color) => {
      let searchFor = `${varPrefix}${color}`

      let currentColor = theme.colors[color]
      let replaceWith =
        typeof currentColor == 'string' ? currentColor : currentColor[variant]

      if (replaceWith) {
        workingTheme = replaceJsonValues(workingTheme, searchFor, replaceWith)
      } else {
        log.error(`Bad format for \`${color}\``)
      }
    })

    result[variant] = {
      name: theme.variants[variant]?.name,
      type: theme.variants[variant]?.type,
      ...JSON.parse(workingTheme),
    }

    if (options.includeNonItalicVariants || options.includeNonItalics) {
      let nonItalicVariant = removeWordFromString(workingTheme, 'italic')

      result[`${variant}-no-italics`] = {
        name: `${theme.variants[variant]?.name} (no italics)`,
        type: theme.variants[variant]?.type,
        ...JSON.parse(nonItalicVariant),
      }
    }
  })

  return result
}
