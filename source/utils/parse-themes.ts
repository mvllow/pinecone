import { getConfig } from './get-config'
import { Theme } from './get-theme'
import { replaceJsonValues } from './replace-json-values'

export const parseThemes = ({ name, type, ...theme }: Theme) => {
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
        console.log(`Bad format for \`${color}\``)
      }
    })

    result[variant] = {
      name: config.theme.variants[variant]?.name,
      type: config.theme.variants[variant]?.type,
      ...JSON.parse(workingTheme),
    }
  })

  return result
}
